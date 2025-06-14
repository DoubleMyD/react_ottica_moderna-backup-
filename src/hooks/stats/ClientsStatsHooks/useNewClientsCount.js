// src/hooks/stats/useNewClientsCount.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../authContext";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { STRAPI_BASE_API_URL } from "../../../data/api";

const useNewClientsCount = (days = 30) => { // Default to last 30 days
  const { authToken } = useAuth();
  const [newClientsCount, setNewClientsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNewClientsCount(0);

    if (!authToken) {
      setError("Autenticazione necessaria per il conteggio nuovi clienti.");
      setLoading(false);
      return;
    }

    try {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days); // Calculate X days ago

      const queryParams = {
        filters: {
          createdAt: { // Assuming 'createdAt' is the field for client registration date
            $gte: dateThreshold.toISOString(),
          },
        },
        fields: ["id"], // Minimal field to get the total count from meta
        pagination: { pageSize: 1 }, // Only need 1 item to get total count
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/clientes?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch new clients: ${response.statusText}`);
      }

      const data = await response.json();
      setNewClientsCount(data.meta.pagination.total);
    } catch (err) {
      console.error(`Error fetching new clients for last ${days} days:`, err);
      setError(err.message);
      setNewClientsCount(0);
    } finally {
      setLoading(false);
    }
  }, [authToken, days]); // Re-fetch if days prop changes

  useEffect(() => {
    fetchNewClients();
  }, [fetchNewClients]);

  return { newClientsCount, loading, error, refetch: fetchNewClients };
};

export default useNewClientsCount;