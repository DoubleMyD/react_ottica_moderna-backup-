// src/hooks/stats/usePromotionUsageRate.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../authContext";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { STRAPI_BASE_API_URL } from "../../../data/api";

const usePromotionUsageRate = () => {
  const { authToken } = useAuth();
  const [usageRate, setUsageRate] = useState(0); // This will be the percentage
  const [totalSent, setTotalSent] = useState(0);
  const [totalUsed, setTotalUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsageRate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUsageRate(0);
    setTotalSent(0);
    setTotalUsed(0);

    if (!authToken) {
      setError("Autenticazione necessaria per il tasso di utilizzo delle promozioni.");
      setLoading(false);
      return;
    }

    try {
      // Fetch all records from cliente_promoziones
      const queryParams = {
        fields: ["data_invio", "data_utilizzo"], // Need both to determine sent vs. used
        pagination: { pageSize: 100000 }, // Fetch all possible records for accurate counts
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(
        `${STRAPI_BASE_API_URL}/storico-promozionis?${queryString}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch promotion usage data: ${response.statusText}`);
      }

      const data = await response.json();
      const usageRecords = data.data || [];

      const currentTotalSent = usageRecords.length;
      const currentTotalUsed = usageRecords.filter(
        (record) => record.data_utilizzo !== null && record.data_utilizzo !== "" // Used means data_utilizzo is present
      ).length;

      const calculatedRate = currentTotalSent > 0 ? (currentTotalUsed / currentTotalSent) : 0;

      setTotalSent(currentTotalSent);
      setTotalUsed(currentTotalUsed);
      setUsageRate(calculatedRate);

    } catch (err) {
      console.error("Error fetching promotion usage rate:", err);
      setError(err.message);
      setUsageRate(0);
      setTotalSent(0);
      setTotalUsed(0);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchUsageRate();
  }, [fetchUsageRate]);

  return { usageRate, totalSent, totalUsed, loading, error, refetch: fetchUsageRate };
};

export default usePromotionUsageRate;