// src/hooks/useAverageOrderValue.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../authContext";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { STRAPI_BASE_API_URL } from "../../../data/api";

const useAverageOrderValue = () => {
  const { authToken } = useAuth();
  const [aov, setAov] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAOV = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAov(0);

    if (!authToken) {
      setError("Autenticazione necessaria per il valore medio transazioni.");
      setLoading(false);
      return;
    }

    try {
      const queryParams = {
        fields: ["prezzo_totale"],
        pagination: { pageSize: 100000 },
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(
        `${STRAPI_BASE_API_URL}/acquistos?${queryString}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message ||
            `Failed to fetch AOV data: ${response.statusText}`
        );
      }

      const data = await response.json();
      const totalRevenue = data.data.reduce(
        (sum, item) => sum + (item.prezzo_totale || 0),
        0
      );
      const totalTransactions = data.data.length;

      setAov(totalTransactions > 0 ? totalRevenue / totalTransactions : 0);
    } catch (err) {
      console.error("Error fetching AOV:", err);
      setError(err.message);
      setAov(0);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchAOV();
  }, [fetchAOV]);

  return { aov, loading, error, refetch: fetchAOV };
};

export default useAverageOrderValue;
