// src/hooks/stats/SinglePromotionStatsHooks/useUniqueProductsInPromotion.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../../../data/api"; // Adjust path
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { useAuth } from "../../authContext"; // Adjust path

const useUniqueProductsInPromotion = (promotionId) => {
  const { authToken } = useAuth();
  const [uniqueProductCount, setUniqueProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUniqueProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUniqueProductCount(0);

    if (!authToken) {
      setError("Autenticazione necessaria per i prodotti unici nella promozione.");
      setLoading(false);
      return;
    }

    if (!promotionId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch the specific promotion and populate its dettaglio_promozionis relation
      const queryParams = {
        filters: {
          id: {
            $eq: promotionId,
          },
        },
        populate: {
          dettaglio_promozionis: {
            populate: {
              prodotto: {
                fields: ["id"], // Only need product ID to count unique products
              },
            },
            fields: ["id"], // Minimal fields for detail itself
          },
        },
        fields: ["id"], // Minimal field for promotion itself
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/promoziones?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch unique products for promotion ${promotionId}: ${response.statusText}`);
      }

      const data = await response.json();
      const promotionData = data.data?.[0]; // Get the single promotion object

      const uniqueProductIds = new Set();
      if (promotionData && promotionData.dettaglio_promozionis) {
        promotionData.dettaglio_promozionis.forEach(detail => {
          if (detail.prodotto && detail.prodotto.id) {
            uniqueProductIds.add(detail.prodotto.id);
          }
        });
      }
      setUniqueProductCount(uniqueProductIds.size);

    } catch (err) {
      console.error(`Error fetching unique products for promotion ${promotionId}:`, err);
      setError(err.message);
      setUniqueProductCount(0);
    } finally {
      setLoading(false);
    }
  }, [authToken, promotionId]);

  useEffect(() => {
    fetchUniqueProducts();
  }, [fetchUniqueProducts]);

  return { uniqueProductCount, loading, error, refetch: fetchUniqueProducts };
};

export default useUniqueProductsInPromotion;