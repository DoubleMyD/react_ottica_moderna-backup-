// src/hooks/stats/useAverageCustomerSpend.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../authContext";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { STRAPI_BASE_API_URL } from "../../../data/api";

const useAverageCustomerSpend = () => {
  const { authToken } = useAuth();
  const [averageSpend, setAverageSpend] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAverageSpend = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAverageSpend(0);

    if (!authToken) {
      setError("Autenticazione necessaria per la spesa media cliente.");
      setLoading(false);
      return;
    }

    try {
      // Fetch all purchases with total price and client relation
      const queryParams = {
        populate: {
          cod_cliente: { // Assuming 'cod_cliente' is the relation name to Client in Acquisto
            fields: ["id"], // Only need client ID for grouping
          },
        },
        fields: ["prezzo_totale"], // Only need total price
        pagination: { pageSize: 100000 }, // Fetch all purchases
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/acquistos?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch data for average customer spend: ${response.statusText}`);
      }

      const data = await response.json();
      const purchases = data.data;

      let totalRevenue = 0;
      const uniqueClients = new Set();

      purchases.forEach(purchase => {
        totalRevenue += (purchase.prezzo_totale || 0);
        if (purchase.cod_cliente?.id) {
          uniqueClients.add(purchase.cod_cliente.id);
        }
      });

      const totalUniqueClients = uniqueClients.size;
      const calculatedAverageSpend = totalUniqueClients > 0 ? (totalRevenue / totalUniqueClients) : 0;

      setAverageSpend(calculatedAverageSpend);

    } catch (err) {
      console.error("Error fetching average customer spend:", err);
      setError(err.message);
      setAverageSpend(0);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchAverageSpend();
  }, [fetchAverageSpend]);

  return { averageSpend, loading, error, refetch: fetchAverageSpend };
};

export default useAverageCustomerSpend;