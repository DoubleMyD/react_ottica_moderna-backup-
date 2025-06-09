// src/hooks/useProductPromotions.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api";
import { buildQueryStringV5 } from "../utils/buildQueryString";

/**
 * Custom hook to fetch 'dettaglioPromozione' entries related to a specific product,
 * and populate the associated 'promozione' data, for Strapi v5.
 *
 * @param {string} documentId - The ID of the product for which to fetch promotions.
 * @returns {object} An object containing:
 * - promotions: An array of 'dettaglioPromozione' objects (Strapi v5 format: id, field1, relation: { id, fieldA }).
 * - loading: A boolean indicating if data is currently being fetched.
 * - error: An error object or null if no error occurred.
 * - refetchPromotions: A function to manually re-trigger the data fetch.
 */
const useProductPromotions = (documentId) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPromotions = useCallback(async () => {
    if (!documentId) {
      setPromotions([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        filters: {
          prodotto: {
            documentId: {
              $eq: documentId,
            },
          },
        },
        populate: {
          // In Strapi v5, direct population of relations brings the related object directly.
          promozione: {
            fields: ["titolo", "descrizione", "data_inizio", "data_fine"],
          },
          // Fields directly on 'dettaglioPromozione' are fetched by default
          // when not in populate, but you can explicitly request them with 'fields'.
          // However, for direct fields, often no 'fields' object is needed at this level
          // unless you're trying to pick specific ones when not populating relations.
          // For now, removing `fields` from here as it might be redundant for direct fields in v5.
          // fields: ["tipo_applicazione", "valore"],
        },
      };

      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(
        `${STRAPI_BASE_API_URL}/dettaglio-promozionis?${queryString}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch promotions: ${response.statusText}`);
      }

      const data = await response.json();
      // In Strapi v5, collections still return a 'data' array at the top level,
      // but items within the array no longer have an 'attributes' wrapper.
      setPromotions(data.data || []);
    } catch (err) {
      console.error("Error fetching product promotions:", err);
      setError(err.message);
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  return { promotions, loading, error, refetchPromotions: fetchPromotions };
};

export default useProductPromotions;
