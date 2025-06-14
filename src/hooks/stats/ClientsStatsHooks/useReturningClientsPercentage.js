// src/hooks/stats/useReturningClientsPercentage.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../authContext";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { STRAPI_BASE_API_URL } from "../../../data/api";

const useReturningClientsPercentage = () => {
  const { authToken } = useAuth();
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReturningClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPercentage(0);

    if (!authToken) {
      setError("Autenticazione necessaria per la percentuale clienti riacquistanti.");
      setLoading(false);
      return;
    }

    try {
      // Fetch all purchases with client relation
      const queryParams = {
        populate: {
          cod_cliente: { // Assuming 'cod_cliente' is the relation name to Client in Acquisto
            fields: ["id"], // Only need client ID for grouping
          },
        },
        fields: ["id"], // Minimal field for the main purchase
        pagination: { pageSize: 100000 }, // Fetch all purchases for accurate counts
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/acquistos?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch purchase data for returning clients: ${response.statusText}`);
      }

      const data = await response.json();
      const purchases = data.data;

      const clientPurchaseCounts = new Map(); // Map: clientId -> count of purchases
      const uniqueClients = new Set(); // Set: unique clientIds

      purchases.forEach(purchase => {
        const clientId = purchase.cod_cliente?.id; // Access client ID from relation
        if (clientId) {
          uniqueClients.add(clientId);
          clientPurchaseCounts.set(clientId, (clientPurchaseCounts.get(clientId) || 0) + 1);
        }
      });

      let returningClients = 0;
      clientPurchaseCounts.forEach(count => {
        if (count > 1) { // Clients who made more than one purchase
          returningClients++;
        }
      });

      const totalUniqueClients = uniqueClients.size;
      const calculatedPercentage = totalUniqueClients > 0 ? (returningClients / totalUniqueClients) : 0;

      setPercentage(calculatedPercentage);

    } catch (err) {
      console.error("Error fetching returning clients percentage:", err);
      setError(err.message);
      setPercentage(0);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchReturningClients();
  }, [fetchReturningClients]);

  return { percentage, loading, error, refetch: fetchReturningClients };
};

export default useReturningClientsPercentage;