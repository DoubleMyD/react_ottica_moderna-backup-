// src/hooks/useClientPromotions.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api";
import { buildQueryStringV5 } from "../utils/buildQueryString";
import { useAuth } from "./authContext"; // Assuming authContext is correctly set up

/**
 * Custom hook to fetch promotions associated with a specific client from Strapi.
 * It queries the `cliente_promoziones` (promotion usage) collection and populates
 * the actual `promozione` details.
 *
 * @param {string} clientId - The Strapi internal ID of the client to fetch promotions for.
 * @returns {object} An object containing:
 * - relevantPromotions: An array of promotion objects.
 * - loading: A boolean indicating if promotions are currently being fetched.
 * - error: An error object or null if no error occurred.
 * - refetchPromotions: A function to manually re-trigger the promotions fetch.
 */
const useClientPromotions = (clientId) => {
  const [relevantPromotions, setRelevantPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken } = useAuth();

  const fetchPromotionsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRelevantPromotions([]); // Clear previous data

    if (!authToken) {
      setError("Autenticazione necessaria per visualizzare le promozioni.");
      setLoading(false);
      return;
    }

    if (!clientId) {
      // If no client ID, return empty promotions (or error if strictly required)
      setLoading(false);
      return;
    }

    try {
      const queryParams = {
        filters: {
          cliente: {
            id: {
              $eq: clientId, // Filter by the client's Strapi internal ID
            },
          },
        },
        populate: {
          promozione: {
            fields: ["titolo", "descrizione", "documentId"], // Fields for the actual promotion
          },
        },
        // We only need specific fields from the cliente_promoziones record itself
        fields: ["data_invio", "data_utilizzo", "documentId"],
        pagination: { pageSize: 100000 }, // Fetch all for this client
      };

      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(
        `${STRAPI_BASE_API_URL}/storico-promozionis?${queryString}`, // Query the promotion usage collection
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
            `Failed to fetch client promotions: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Raw response Client Promotions Usage:", data);

      // Map the usage records to extract just the promotion details
      const extractedPromotions = data.data
        .map((usageRecord) => ({
          id: usageRecord.promozione?.id, // Get ID from the actual promotion
          titolo: usageRecord.promozione?.titolo,
          descrizione: usageRecord.promozione?.descrizione,
          documentId: usageRecord.promozione?.documentId,
          immagine: usageRecord.promozione?.immagine_principale?.[0]?.url, // Get promotion image
          // You can also include data_invio and data_utilizzo from the usageRecord directly if needed
          data_invio: usageRecord.data_invio,
          data_utilizzo: usageRecord.data_utilizzo,
        }))
        .filter((promo) => promo.id); // Filter out any usage records without a valid promotion

      setRelevantPromotions(extractedPromotions);
    } catch (err) {
      console.error("Error fetching client promotions:", err);
      setError(err.message);
      setRelevantPromotions([]);
    } finally {
      setLoading(false);
    }
  }, [clientId, authToken]); // Dependencies: clientId, authToken

  useEffect(() => {
    // Only fetch if a valid clientId is provided
    if (clientId) {
      fetchPromotionsData();
    } else {
      setRelevantPromotions([]); // Clear data if no ID
      setLoading(false);
      setError(null);
    }
  }, [clientId, fetchPromotionsData]);

  return {
    relevantPromotions,
    loading,
    error,
    refetchPromotions: fetchPromotionsData,
  };
};

export default useClientPromotions;
