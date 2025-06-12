// src/hooks/useClientDetail.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api";
import { buildQueryStringV5 } from "../utils/buildQueryString";
import { useAuth } from "./authContext";

/**
 * Custom hook to fetch detailed data for a specific client from Strapi.
 * Fetches core client attributes, associated user, and client types.
 * It DOES NOT fetch purchase history or promotions, as those are handled by separate hooks.
 *
 * @param {string} clientDocumentId - The `documentId` of the client to fetch.
 * @returns {object} An object containing:
 * - client: The detailed client object (without purchase history or promotions).
 * - loading: A boolean indicating if data is currently being fetched.
 * - error: An error object or null if no error occurred.
 * - refetchClient: A function to manually re-trigger the client fetch.
 */
const useClientDetail = (clientDocumentId) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken } = useAuth();

  const fetchClientData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!authToken) {
      setError(
        "Autenticazione necessaria per visualizzare i dettagli del cliente."
      );
      setLoading(false);
      return;
    }

    if (!clientDocumentId) {
      setError("ID Documento cliente non fornito.");
      setLoading(false);
      return;
    }

    try {
      const queryParams = {
        filters: {
          documentId: {
            $eq: clientDocumentId,
          },
        },
        populate: {
          user: {
            fields: ["email", "username", "documentId"],
          },
          tipologia_clientes: {
            fields: ["nome", "descrizione"],
          },
          // REMOVED: storico_acquisti populate (now in usePurchaseHistory)
          // REMOVED: cliente_promoziones populate (now in useClientPromotions)
        },
        fields: [
          "nome",
          "cognome",
          "data_nascita",
          "indirizzo",
          "citta",
          "cap",
          "nazionalita",
          "iscrizione_newsletter",
          "documentId", // Ensure documentId is always fetched
        ],
      };

      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(
        `${STRAPI_BASE_API_URL}/clientes?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Non autorizzato. Effettua il login come amministratore."
          );
        }
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message ||
            `Failed to fetch client (documentId: ${clientDocumentId}): ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Raw response Client Detail (core):", data);

      if (!data.data || data.data.length === 0) {
        setClient(null);
        setError("Client not found.");
        return;
      }

      const clientData = data.data[0];
      setClient(clientData);
    } catch (err) {
      console.error("Error fetching client detail:", err);
      setError(err.message);
      setClient(null);
    } finally {
      setLoading(false);
    }
  }, [clientDocumentId, authToken]);

  useEffect(() => {
    if (clientDocumentId) {
      fetchClientData();
    }
  }, [clientDocumentId, fetchClientData]);

  return { client, loading, error, refetchClient: fetchClientData };
};

export default useClientDetail;
