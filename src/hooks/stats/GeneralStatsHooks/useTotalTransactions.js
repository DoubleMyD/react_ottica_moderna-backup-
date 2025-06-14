// src/hooks/useTotalTransactions.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../../../data/api";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { useAuth } from "../../authContext";

const useTotalTransactions = () => {
  const { authToken } = useAuth();
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactionsCount = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTotalTransactions(0);

    if (!authToken) {
      setError("Autenticazione necessaria per il conteggio transazioni.");
      setLoading(false);
      return;
    }

    try {
      // Fetch only meta.pagination.total for the count
      const queryParams = {
        fields: ["id"], // Requesting a minimal field just to get count
        pagination: { pageSize: 1 }, // Only need 1 item to get total count from meta
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
            `Failed to fetch transaction count: ${response.statusText}`
        );
      }

      const data = await response.json();
      setTotalTransactions(data.meta.pagination.total);
    } catch (err) {
      console.error("Error fetching total transactions:", err);
      setError(err.message);
      setTotalTransactions(0);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchTransactionsCount();
  }, [fetchTransactionsCount]);

  return { totalTransactions, loading, error, refetch: fetchTransactionsCount };
};

export default useTotalTransactions;
