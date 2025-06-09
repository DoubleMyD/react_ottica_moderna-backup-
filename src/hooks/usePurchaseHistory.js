import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api";
import { useAuth } from "../hooks/authContext";
import { buildQueryStringV5 } from "../utils/buildQueryString";
import useUserAndClienteData from "../hooks/useUserAndClienteData";



const usePurchaseHistory = () => {
  const { authToken } = useAuth();
  const {
    clienteData,
    loading: clientLoading,
    error: clientError,
  } = useUserAndClienteData();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!authToken || !clienteData || !clienteData.id) {
      if (!authToken) {
        setError(
          "Autenticazione necessaria per visualizzare lo storico acquisti."
        );
      } else if (!clienteData) {
        setError(
          "Dati cliente non disponibili. Impossibile caricare lo storico."
        );
      } else if (!clienteData.id) {
        setError("ID cliente non disponibile per filtrare gli acquisti.");
      }
      setLoading(false);
      return;
    }

    const clienteId = clienteData.id;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

    try {
      // **MODIFIED: Renamed 'promozione' to 'dettaglio_promozioni'**
      const populateParams = {
        filters: {
          cod_cliente: {
            id: {
              $eq: clienteId,
            },
          },
        },
        sort: "data:desc",
        populate: {
          dettaglio_acquistos: {
            populate: {
              prodotto: {
                populate: {
                  immagine: {
                    fields: [
                      "name",
                      "alternativeText",
                      "width",
                      "height",
                      "url",
                    ],
                  },
                },
                fields: ["nome", "documentId"],
              },
              // !! IMPORTANT CHANGE HERE !!
              dettaglio_promozioni: {
                // Changed from 'promozione' to 'dettaglio_promozioni'
                fields: ["*"], // Get all fields from 'dettaglio_promozioni'
              },
            },
          },
        },
      };

      const queryString = buildQueryStringV5(populateParams);
      console.log(
        "Generated Populate Query String (Strapi V5 - Final Attempt):",
        queryString
      );

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
        console.error("API Error Response (Strapi V5):", errorData);
        throw new Error(
          errorData.error?.message ||
            `Errore fetching storico acquisti! Status: ${response.status}`
        );
      }

      const responseData = await response.json();
      console.log("Fetched Purchase History (Strapi V5):", responseData);
      setPurchases(responseData.data);
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Il caricamento dello storico acquisti è scaduto. Riprova.");
      } else {
        console.error("Failed to fetch purchase history:", err);
        setError(
          `Errore nel caricamento dello storico acquisti: ${err.message}.`
        );
      }
    } finally {
      setLoading(false);
      clearTimeout(timeoutId);
    }
  }, [authToken, clienteData]);

  useEffect(() => {
    if (!clientLoading && clienteData && clienteData.id) {
      fetchPurchases();
    } else if (!clientLoading && clientError) {
      setError(clientError);
      setLoading(false);
    } else if (!clientLoading && !clienteData) {
      setError("Nessun profilo cliente associato trovato.");
      setLoading(false);
    }
  }, [clientLoading, clienteData, clientError, fetchPurchases]);

  return { purchases, loading, error, refetchPurchases: fetchPurchases };
};

export default usePurchaseHistory;
