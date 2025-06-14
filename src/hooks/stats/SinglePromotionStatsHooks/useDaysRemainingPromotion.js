// src/hooks/stats/SinglePromotionStatsHooks/useDaysRemainingPromotion.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../../../data/api"; // Adjust path
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { useAuth } from "../../authContext"; // Adjust path

const useDaysRemainingPromotion = (promotionId) => {
  const { authToken } = useAuth();
  const [daysRemaining, setDaysRemaining] = useState(null); // Can be positive, negative (expired), or null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateDays = useCallback((endDateString) => {
    if (!endDateString) return null;
    const endDate = new Date(endDateString);
    const now = new Date();
    // Set both to start of day to compare full days
    const endOfDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = endOfDay.getTime() - startOfToday.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  }, []);

  const fetchDaysRemaining = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDaysRemaining(null);

    if (!authToken) {
      setError("Autenticazione necessaria per i giorni rimanenti della promozione.");
      setLoading(false);
      return;
    }

    if (!promotionId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch only the specific promotion's end date
      const queryParams = {
        filters: {
          id: {
            $eq: promotionId,
          },
        },
        fields: ["data_fine"],
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/promoziones?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch promotion end date for ${promotionId}: ${response.statusText}`);
      }

      const data = await response.json();
      const promotionData = data.data?.[0]; // Get the single promotion object

      if (promotionData && promotionData.data_fine) {
        setDaysRemaining(calculateDays(promotionData.data_fine));
      } else {
        setDaysRemaining(null); // No end date or promotion not found
      }

    } catch (err) {
      console.error(`Error fetching days remaining for promotion ${promotionId}:`, err);
      setError(err.message);
      setDaysRemaining(null);
    } finally {
      setLoading(false);
    }
  }, [authToken, promotionId, calculateDays]);

  useEffect(() => {
    fetchDaysRemaining();
  }, [fetchDaysRemaining]);

  return { daysRemaining, loading, error, refetch: fetchDaysRemaining };
};

export default useDaysRemainingPromotion;