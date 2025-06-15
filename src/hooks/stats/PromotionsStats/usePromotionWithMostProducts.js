// src/hooks/stats/usePromotionWithMostProducts.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../../../data/api";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { useAuth } from "../../authContext";

const usePromotionWithMostProducts = () => {
  const { authToken } = useAuth();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPromotion = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPromotion(null);

    if (!authToken) {
      setError("Autenticazione necessaria per la promozione con più prodotti.");
      setLoading(false);
      return;
    }

    try {
      // Fetch all promotions with their associated dettaglio_promozionis (to count products)
      const queryParams = {
        populate: {
          dettaglio_promozionis: {
            populate: {
              prodottos: { // Ensure product is populated to confirm it's linked
                fields: ["id"], // Minimal field to confirm product presence
              },
            },
            fields: ["id"], // Minimal field for detail itself
          },
        },
        fields: ["titolo", "documentId"], // Get promotion title
        pagination: { pageSize: 100000 },
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/promoziones?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch promotions for product count: ${response.statusText}`);
      }

      const data = await response.json();
      const promotions = data.data || [];

      let topPromotion = null;
      let maxProductCount = -1;

      promotions.forEach(promo => {
        let currentProductCount = 0;
        if (promo.dettaglio_promozionis) {
          promo.dettaglio_promozionis.forEach(detail => {
            if (detail.prodotto) { // Only count if a product is actually linked
              currentProductCount++;
            }
          });
        }

        if (currentProductCount > maxProductCount) {
          maxProductCount = currentProductCount;
          topPromotion = {
            id: promo.id,
            documentId: promo.documentId,
            titolo: promo.titolo,
            productCount: currentProductCount,
          };
        }
      });

      setPromotion(topPromotion);

    } catch (err) {
      console.error("Error fetching promotion with most products:", err);
      setError(err.message);
      setPromotion(null);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchPromotion();
  }, [fetchPromotion]);

  return { promotion, loading, error, refetch: fetchPromotion };
};

export default usePromotionWithMostProducts;