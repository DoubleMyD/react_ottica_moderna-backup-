// src/hooks/usePromotionDetails.js
import { useState, useEffect, useCallback, useRef } from "react";
import { STRAPI_BASE_API_URL, STRAPI_BASE_URL } from "../data/api";
import { buildQueryStringV5 } from "../utils/buildQueryString";
import { useAuth } from "./authContext";

/**
 * Custom hook to fetch details for a single promotion,
 * including its related 'dettaglio_promozionis' and their 'prodotto' (with image).
 * Designed for Strapi v5's flattened data structure.
 *
 * @param {string} promotionDocumentId - The document ID of the promotion to fetch.
 * @returns {object} An object containing:
 * - promotion: The single promotion object, or null.
 * - loading: A boolean indicating if data is currently being fetched.
 * - error: An error object or null if no error occurred.
 * - refetch: A function to manually re-trigger the data fetch.
 */
const usePromotionDetail = (promotionDocumentId) => {
  const { authToken } = useAuth();
  const [promotion, setPromotion] = useState(null);
  const [involvedProducts, setInvolvedProducts] = useState([]); // NEW state for products
  const [loading, setLoading] = useState(true); // Start loading true
  const [error, setError] = useState(null);

  const fetchPromotion = useCallback(async () => {
    setLoading(true);
    setError(null);
    setInvolvedProducts([]); // Reset products on new fetch

    if (!promotionDocumentId) {
      setError("ID promozione mancante.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    try {
      const queryParams = {
        populate: {
          dettaglio_promozionis: {
            // Name of the relation on your 'Promozione' content type
            fields: ["tipo_applicazione", "valore"],
            populate: {
              prodotto: {
                // Name of the relation on your 'DettaglioPromozione' content type
                fields: ["brand", "nome", "prezzo_unitario", "descrizione"], // Fields needed from product
                populate: {
                  immagine: {
                    fields: ["url", "name"], // Fields needed from product image
                  },
                },
              },
            },
          },
          tipologia_clientes: {
            populate: {
              clientes: {
                fields: ["*"],
              },
            },
            fields: ["nome", "descrizione", "tratti_caratteristici"],
          },
        },
        // Fields for the main 'promozione' itself
        fields: [
          "titolo",
          "descrizione",
          "data_inizio",
          "data_fine",
          "documentId",
          "codice",
        ],
      };

      const queryString = buildQueryStringV5(queryParams);

      // Fetch a single promotion by its ID
      const response = await fetch(
        `${STRAPI_BASE_API_URL}/promoziones/${promotionDocumentId}?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `Promozione con ID ${promotionDocumentId} non trovata.`
          );
        }
        throw new Error(
          `Failed to fetch promotion details: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Raw Promotion details : ", data);

      const fetchedPromotionData = data.data || data;
      // Strapi v5 for single entries typically returns the object directly,
      // or wraps it in 'data'. We'll assume the direct object for simplicity
      // and adapt the component to handle potential `data` wrapper.
      setPromotion(fetchedPromotionData); // Handle both direct object or {data: object}

      // --- Extract and Consolidate Unique Products ---
      const productsMap = new Map(); // Map to store unique products by documentId

      if (fetchedPromotionData.dettaglio_promozionis) {
        fetchedPromotionData.dettaglio_promozionis.forEach((dettaglio) => {
          const product = dettaglio.prodotto;
          if (product && product.documentId) {
            if (!productsMap.has(product.documentId)) {
              productsMap.set(product.documentId, {
                id: product.id,
                documentId: product.documentId,
                nome: product.nome,
                prezzo_unitario: product.prezzo_unitario,
                descrizione: product.descrizione,
                immagine: product.immagine, // Storing the direct URL
                brand: product.brand,
                // NEW: Add promotion-specific details to the product object
                tipo_applicazione_promozione: dettaglio.tipo_applicazione,
                valore_promozione: dettaglio.valore,
              });
            }
          }
        });
      }
      setInvolvedProducts(Array.from(productsMap.values()));
    } catch (err) {
      console.error("Error fetching promotion details:", err);
      setError(err.message);
      setPromotion(null);
    } finally {
      setLoading(false);
      clearTimeout(id);
    }
  }, [promotionDocumentId, authToken]);

  useEffect(() => {
    if (promotionDocumentId) {
      fetchPromotion();
    } else {
      setLoading(false);
      setError(null);
      setPromotion(null);
      setInvolvedProducts([]);
    }
  }, [promotionDocumentId, fetchPromotion]); // Re-fetch when promotionDocumentId or fetchPromotion changes

  return {
    promotion,
    involvedProducts,
    loading,
    error,
    refetch: fetchPromotion,
  };
};

export default usePromotionDetail;
