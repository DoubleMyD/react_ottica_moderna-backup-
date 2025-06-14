// src/hooks/stats/useTotalRegisteredClients.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../authContext";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { STRAPI_BASE_API_URL } from "../../../data/api";

const useTotalRegisteredClients = () => {
  const { authToken } = useAuth();
  const [totalClients, setTotalClients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTotalClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTotalClients(0);

    if (!authToken) {
      setError("Autenticazione necessaria per il conteggio totale clienti.");
      setLoading(false);
      return;
    }

    try {
      const queryParams = {
        fields: ["id"], // Minimal field to get the total count from meta
        pagination: { pageSize: 1 }, // Only need 1 item to get total count
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/clientes?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch total clients: ${response.statusText}`);
      }

      const data = await response.json();
      setTotalClients(data.meta.pagination.total);
    } catch (err) {
      console.error("Error fetching total clients:", err);
      setError(err.message);
      setTotalClients(0);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchTotalClients();
  }, [fetchTotalClients]);

  return { totalClients, loading, error, refetch: fetchTotalClients };
};

export default useTotalRegisteredClients;