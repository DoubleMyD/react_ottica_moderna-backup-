// src/hooks/useProductPromotions.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api";
import { buildQueryStringV5 } from "../utils/buildQueryString";

/**
 * Custom hook to fetch 'dettaglioPromozione' entries related to a specific product,
 * and return a unique list of associated 'promozione' data, with their
 * respective 'dettaglio_promozioni' details.
 *
 * @param {string} documentId - The documentID of the product for which to fetch promotions.
 * @returns {object} An object containing:
 * - promotions: An array of unique 'promozione' objects. Each 'promozione' object
 * will include an additional array `relatedDettaglioPromozionis`
 * containing the 'dettaglio_promozione' instances that link it to this product.
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
        populate: {
          // We are populating the product's 'dettaglio_promozionis' relation
          dettaglio_promozionis: {
            populate: {
              // And within each 'dettaglio_promozioni', we populate the 'promozione' itself
              promozione: {
                fields: [
                  "titolo",
                  "descrizione",
                  "data_inizio",
                  "data_fine",
                  "documentId",
                ], // Added documentId here too
              },
            },
            // Fields needed from dettaglio_promozione to uniquely identify it and its specific value/type
            fields: ["tipo_applicazione", "valore", "documentId"],
          },
        },
      };

      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(
        `${STRAPI_BASE_API_URL}/prodottos/${documentId}?${queryString}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch product promotions: ${response.statusText}`
        );
      }

      const rawData = await response.json();
      console.log("useProductPromotions Raw Fetch : ", rawData);

      // In Strapi v5, fetching a single entry returns the item directly under 'data'.
      // The populated relations like 'dettaglio_promozionis' are directly on this data object.
      const productData = rawData.data;

      // Use a Map to store unique promotions, keyed by their ID
      // The value will be the promotion object, extended with a list of its related dettaglio_promozionis
      const uniquePromotionsMap = new Map();

      if (productData && productData.dettaglio_promozionis) {
        productData.dettaglio_promozionis.forEach((dettaglio_promozione) => {
          const promotion = dettaglio_promozione.promozione;

          if (promotion) {
            // Check if this promotion ID has already been added to our map
            if (!uniquePromotionsMap.has(promotion.id)) {
              // If not, add the promotion itself to the map
              uniquePromotionsMap.set(promotion.id, {
                id: promotion.id,
                documentId: promotion.documentId, // Assuming documentId is fetched for promozione
                titolo: promotion.titolo,
                descrizione: promotion.descrizione,
                data_inizio: promotion.data_inizio,
                data_fine: promotion.data_fine,
                // Initialize an array to hold all 'dettaglio_promozionis' related to this unique promotion
                relatedDettaglioPromozionis: [],
              });
            }

            // Get the promotion object from the map (either newly added or existing)
            const currentPromotion = uniquePromotionsMap.get(promotion.id);

            // Add the current 'dettaglio_promozione' details to its related list
            currentPromotion.relatedDettaglioPromozionis.push({
              id: dettaglio_promozione.id,
              documentId: dettaglio_promozione.documentId,
              tipo_applicazione: dettaglio_promozione.tipo_applicazione,
              valore: dettaglio_promozione.valore,
              // Do NOT include the nested 'promozione' object again to avoid deep nesting/circular issues
            });
          }
        });
      }

      // Convert the Map values (which are the unique promotion objects with their related details) to an array
      setPromotions(Array.from(uniquePromotionsMap.values()));
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
