// src/hooks/stats/SinglePromotionStatsHooks/useAverageDiscountValue.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../../../data/api"; // Adjust path
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { useAuth } from "../../authContext"; // Adjust path

const useAverageDiscountValue = (promotionId) => {
  const { authToken } = useAuth();
  const [averageDiscount, setAverageDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAverageDiscount = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAverageDiscount(0);

    if (!authToken) {
      setError("Autenticazione necessaria per il valore medio sconto.");
      setLoading(false);
      return;
    }

    if (!promotionId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch the specific promotion and populate its dettaglio_promozionis
      const queryParams = {
        filters: {
          id: {
            $eq: promotionId,
          },
        },
        populate: {
          dettaglio_promozionis: {
            fields: ["valore", "tipo_applicazione"], // Get discount value and type
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
        throw new Error(errorData.error?.message || `Failed to fetch average discount for promotion ${promotionId}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Avg discount : ", data);
      const promotionData = data.data?.[0]; // Get the single promotion object

      let totalDiscountValue = 0;
      let applicableDetailsCount = 0; // Count details that offer a relevant discount

      if (promotionData && promotionData.dettaglio_promozionis) {
        promotionData.dettaglio_promozionis.forEach(detail => {
          // Only consider 'valore' for actual discounts (e.g., 'percentage', 'fixed')
          // You might need to adjust 'tipo_applicazione' logic based on your Strapi setup
          if (detail.valore !== undefined && detail.valore !== null &&
              (detail.tipo_applicazione === 'percentuale' || detail.tipo_applicazione === 'fisso' || detail.tipo_applicazione === 'sconto')) {
            totalDiscountValue += detail.valore;
            applicableDetailsCount++;
          }
        });
      }

      setAverageDiscount(applicableDetailsCount > 0 ? totalDiscountValue / applicableDetailsCount : 0);

    } catch (err) {
      console.error(`Error fetching average discount for promotion ${promotionId}:`, err);
      setError(err.message);
      setAverageDiscount(0);
    } finally {
      setLoading(false);
    }
  }, [authToken, promotionId]);

  useEffect(() => {
    fetchAverageDiscount();
  }, [fetchAverageDiscount]);

  return { averageDiscount, loading, error, refetch: fetchAverageDiscount };
};

export default useAverageDiscountValue;