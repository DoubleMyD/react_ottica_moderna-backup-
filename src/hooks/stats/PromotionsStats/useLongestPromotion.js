// src/hooks/stats/useLongestPromotion.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../../../data/api";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { useAuth } from "../../authContext";

const useLongestPromotion = () => {
  const { authToken } = useAuth();
  const [longestPromotion, setLongestPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateDurationInDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  };

  const fetchLongestPromotion = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLongestPromotion(null);

    if (!authToken) {
      setError("Autenticazione necessaria per la promozione più lunga.");
      setLoading(false);
      return;
    }

    try {
      // Fetch all promotions with their start and end dates
      const queryParams = {
        fields: ["titolo", "data_inizio", "data_fine", "documentId"],
        pagination: { pageSize: 100000 },
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/promoziones?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch promotions for duration: ${response.statusText}`);
      }

      const data = await response.json();
      const promotions = data.data || [];

      let topPromotion = null;
      let maxDurationDays = 0;

      promotions.forEach(promo => {
        const duration = calculateDurationInDays(promo.data_inizio, promo.data_fine);
        if (duration > maxDurationDays) {
          maxDurationDays = duration;
          topPromotion = {
            id: promo.id,
            documentId: promo.documentId,
            titolo: promo.titolo,
            durationDays: duration,
          };
        }
      });

      setLongestPromotion(topPromotion);

    } catch (err) {
      console.error("Error fetching longest promotion:", err);
      setError(err.message);
      setLongestPromotion(null);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchLongestPromotion();
  }, [fetchLongestPromotion]);

  return { longestPromotion, loading, error, refetch: fetchLongestPromotion };
};

export default useLongestPromotion;