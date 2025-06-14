// src/hooks/stats/useTotalActivePromotions.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../../../data/api";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { useAuth } from "../../authContext";

const useTotalActivePromotions = () => {
  const { authToken } = useAuth();
  const [activePromotionsCount, setActivePromotionsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivePromotions = useCallback(async () => {
    setLoading(true);
    setError(null);
    setActivePromotionsCount(0);

    if (!authToken) {
      setError("Autenticazione necessaria per il conteggio promozioni attive.");
      setLoading(false);
      return;
    }

    try {
      const now = new Date();
      
      // Fetch all promotions, focusing on dates
      const queryParams = {
        fields: ["data_inizio", "data_fine"],
        pagination: { pageSize: 100000 },
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/promoziones?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch active promotions: ${response.statusText}`);
      }

      const data = await response.json();
      const promotions = data.data || [];

      let activeCount = 0;
      promotions.forEach(promo => {
        const startDate = new Date(promo.data_inizio);
        const endDate = new Date(promo.data_fine);

        // A promotion is active if its start date is in the past or today, and its end date is in the future or today.
        if (startDate <= now && endDate >= now) {
          activeCount++;
        }
      });
      setActivePromotionsCount(activeCount);

    } catch (err) {
      console.error("Error fetching active promotions:", err);
      setError(err.message);
      setActivePromotionsCount(0);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchActivePromotions();
  }, [fetchActivePromotions]);

  return { activePromotionsCount, loading, error, refetch: fetchActivePromotions };
};

export default useTotalActivePromotions;