// src/hooks/usePurchaseHistory.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL, STRAPI_BASE_URL } from "../data/api";
import { useAuth } from "../hooks/authContext";
import { buildQueryStringV5 } from "../utils/buildQueryString";

const usePurchaseHistory = (clientId = "") => {
  const { authToken } = useAuth();

  const [purchases, setPurchases] = useState([]);
  const [mostPurchasedProduct, setMostPurchasedProduct] = useState(null);
  const [totalProductSpent, setTotalProductSpent] = useState(0); // Total spent on the *most purchased product*
  const [allTimeSpent, setAllTimeSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPurchases([]);
    setMostPurchasedProduct(null);
    setTotalProductSpent(0);
    setAllTimeSpent(0);

    if (!authToken || !clientId) {
      if (!authToken) {
        setError(
          "Autenticazione necessaria per visualizzare lo storico acquisti."
        );
      } else if (!clientId) {
        setError("ID cliente non disponibile per filtrare gli acquisti.");
      }
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

    try {
      const populateParams = {
        filters: {
          cod_cliente: {
            id: {
              $eq: clientId,
            },
          },
        },
        sort: "data:desc", // Assuming 'data' is the date field for the main purchase
        populate: {
          dettaglio_acquistos: {
            populate: {
              prodotto: {
                populate: {
                  immagine: {
                    fields: ["url"], // Only need the URL for the image
                  },
                },
                fields: ["nome", "documentId"],
              },
              dettaglio_promozioni: {
                fields: ["*"],
              },
            },
            // Ensure you fetch original and discounted prices for correct calculation
            fields: [
              "quantita",
              "prezzo_unitario_originale",
              "prezzo_unitario_scontato",
            ],
          },
        },
        // Corrected fields based on your JSON response structure
        fields: ["data", "quantita_totale", "prezzo_totale", "documentId"],
        pagination: { pageSize: 1000 },
      };

      const queryString = buildQueryStringV5(populateParams);

      const response = await fetch(
        `${STRAPI_BASE_API_URL}/acquistos?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response (Purchase History):", errorData);
        throw new Error(
          errorData.error?.message ||
            `Errore fetching storico acquisti! Status: ${response.status}`
        );
      }

      const responseData = await response.json();
      console.log("Fetched Purchase History:", responseData);

      // --- CORRECTION STARTS HERE ---
      const fetchedPurchases = responseData.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        data_acquisto: item.data, // Corrected: use 'data' from the top level
        importo_totale: item.prezzo_totale, // Corrected: use 'prezzo_totale'
        quantita_totale: item.quantita_totale, // Added: if you want to display this
        dettaglio_acquistos:
          item.dettaglio_acquistos?.map((detail) => ({
            id: detail.id,
            quantita: detail.quantita,
            // Use prezzo_unitario_scontato for calculations if available, else original
            prezzo_unitario_originale: detail.prezzo_unitario_originale,
            prezzo_unitario_scontato: detail.prezzo_unitario_scontato,
            prodotto: detail.prodotto
              ? {
                  id: detail.prodotto.id,
                  documentId: detail.prodotto.documentId,
                  nome: detail.prodotto.nome,
                  immagine: detail.prodotto.immagine,
                }
              : null,
            dettaglio_promozioni: detail.dettaglio_promozioni
              ? {
                  id: detail.dettaglio_promozioni.id,
                  // Add other promotion fields you need from dettaglio_promozioni
                  tipo_applicazione:
                    detail.dettaglio_promozioni.tipo_applicazione,
                  valore: detail.dettaglio_promozioni.valore,
                }
              : null,
          })) || [],
      }));

      setPurchases(fetchedPurchases);

      // --- Calculate Most Purchased Product and Total Spent ---
      const productTallies = {}; // { productId: { count: N, totalValue: X, productInfo: {} } }
      let currentAllTimeSpent = 0;

      fetchedPurchases.forEach((purchase) => {
        currentAllTimeSpent += purchase.importo_totale || 0; // Ensure it's a number

        purchase.dettaglio_acquistos.forEach((detail) => {
          if (detail.prodotto) {
            const productId = detail.prodotto.id;
            const quantity = detail.quantita;
            // Use the calculated prezzo_unitario (which considers discounted price)
            const price = detail.prezzo_unitario_originale;

            if (!productTallies[productId]) {
              productTallies[productId] = {
                count: 0,
                totalValue: 0,
                productInfo: detail.prodotto, // Store the product info for direct use
              };
            }
            productTallies[productId].count += quantity;
            productTallies[productId].totalValue += quantity * price;
          }
        });
      });

      let mostPurchased = null;
      let highestCount = 0;
      let totalSpentForMostPurchased = 0;

      // Find the most purchased product (based on highest total quantity)
      for (const productId in productTallies) {
        if (productTallies[productId].count > highestCount) {
          highestCount = productTallies[productId].count;
          mostPurchased = productTallies[productId].productInfo;
          totalSpentForMostPurchased = productTallies[productId].totalValue;
        }
        // If counts are equal, you might want to add another tie-breaking rule
        // For simplicity, it currently just takes the first one it encounters.
      }

      setMostPurchasedProduct(mostPurchased);
      setTotalProductSpent(totalSpentForMostPurchased);
      setAllTimeSpent(currentAllTimeSpent);
      // --- CORRECTION ENDS HERE ---
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Il caricamento dello storico acquisti è scaduto. Riprova.");
      } else {
        console.error("Failed to fetch purchase history:", err);
        setError(
          `Errore nel caricamento dello storico acquisti: ${err.message}.`
        );
      }
      setPurchases([]);
      setMostPurchasedProduct(null);
      setTotalProductSpent(0);
      setAllTimeSpent(0);
    } finally {
      setLoading(false);
      clearTimeout(timeoutId);
    }
  }, [authToken, clientId]);

  useEffect(() => {
    if (clientId) {
      fetchPurchases();
    } else {
      setPurchases([]);
      setMostPurchasedProduct(null);
      setTotalProductSpent(0);
      setAllTimeSpent(0);

      setLoading(false);
      setError(null);
    }
  }, [clientId, fetchPurchases]);

  return {
    purchases,
    mostPurchasedProduct,
    totalProductSpent,
    allTimeSpent,
    loading,
    error,
    refetchPurchases: fetchPurchases,
  };
};

export default usePurchaseHistory;
