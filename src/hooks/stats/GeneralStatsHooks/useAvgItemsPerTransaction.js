// src/hooks/useAvgItemsPerTransaction.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../authContext";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { STRAPI_BASE_API_URL } from "../../../data/api";
const useAvgItemsPerTransaction = () => {
  const { authToken } = useAuth();
  const [avgItems, setAvgItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAvgItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAvgItems(0);

    if (!authToken) {
      setError("Autenticazione necessaria per gli articoli medi per transazione.");
      setLoading(false);
      return;
    }

    try {
      const queryParams = {
        fields: ["quantita_totale"], // Field for total quantity in the main purchase
        pagination: { pageSize: 100000 },
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/acquistos?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch average items data: ${response.statusText}`);
      }

      const data = await response.json();
      const totalTransactions = data.data.length;
      const totalItemsAcrossTransactions = data.data.reduce((sum, item) => sum + (item.quantita_totale || 0), 0);

      setAvgItems(totalTransactions > 0 ? totalItemsAcrossTransactions / totalTransactions : 0);
    } catch (err) {
      console.error("Error fetching average items per transaction:", err);
      setError(err.message);
      setAvgItems(0);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchAvgItems();
  }, [fetchAvgItems]);

  return { avgItems, loading, error, refetch: fetchAvgItems };
};

export default useAvgItemsPerTransaction;