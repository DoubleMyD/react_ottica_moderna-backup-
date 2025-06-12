// src/hooks/usePromotionUsageStats.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api";
import { buildQueryStringV5 } from "../utils/buildQueryString";
import { useAuth } from "./authContext"; // Assuming authContext is correctly set up

/**
 * Custom hook to fetch usage statistics for a specific promotion.
 * It counts how many times a promotion has been sent and how many times it has been used.
 *
 * @param {string} promotionId - The Strapi internal ID of the promotion to fetch stats for.
 * @returns {object} An object containing:
 * - sentCount: The total number of times the promotion has been sent.
 * - usedCount: The total number of times the promotion has been used (data_utilizzo is not null).
 * - loading: A boolean indicating if data is currently being fetched.
 * - error: An error object or null if no error occurred.
 * - refetchUsageStats: A function to manually re-trigger the stats fetch.
 */
const usePromotionUsageStats = (promotionId) => {
  const { authToken } = useAuth();
  const [sentCount, setSentCount] = useState(0);
  const [usedCount, setUsedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsageStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSentCount(0);
    setUsedCount(0);

    if (!authToken) {
      setError(
        "Autenticazione necessaria per visualizzare le statistiche di utilizzo."
      );
      setLoading(false);
      return;
    }

    if (!promotionId) {
      // If no promotion ID, return default counts (0) and stop loading
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    try {
      // We need to fetch all records related to this promotion
      // and get the data_invio and data_utilizzo fields.
      const queryParams = {
        filters: {
          promozione: {
            id: {
              $eq: promotionId, // Filter by the promotion's Strapi internal ID
            },
          },
        },
        fields: ["data_invio", "data_utilizzo"], // Only need these two fields for counting
        pagination: { pageSize: 100000 }, // Fetch all possible records for accurate counts
      };

      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(
        `${STRAPI_BASE_API_URL}/storico-promozionis?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `Statistiche per promozione con ID ${promotionId} non trovate.`
          );
        }
        throw new Error(
          `Failed to fetch promotion usage stats: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Promotion Usage Stats Raw Response:", data);

      const usageRecords = data.data || [];

      // Calculate sentCount: Total number of records (each record means it was sent)
      const currentSentCount = usageRecords.length;

      // Calculate usedCount: Number of records where data_utilizzo is not null/empty
      const currentUsedCount = usageRecords.filter(
        (record) => record.data_utilizzo !== null && record.data_utilizzo !== ""
      ).length;

      setSentCount(currentSentCount);
      setUsedCount(currentUsedCount);
    } catch (err) {
      console.error("Error fetching promotion usage stats:", err);
      setError(err.message);
      setSentCount(0);
      setUsedCount(0);
    } finally {
      setLoading(false);
      clearTimeout(id);
    }
  }, [promotionId, authToken]); // Dependencies: promotionId, authToken

  useEffect(() => {
    if (promotionId) {
      fetchUsageStats();
    } else {
      setLoading(false);
      setSentCount(0);
      setUsedCount(0);
      setError(null);
    }
  }, [promotionId, fetchUsageStats]);

  return {
    sentCount,
    usedCount,
    loading,
    error,
    refetchUsageStats: fetchUsageStats,
  };
};

export default usePromotionUsageStats;
