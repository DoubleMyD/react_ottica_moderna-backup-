// src/hooks/stats/useClientsByTypeDistribution.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../authContext";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { STRAPI_BASE_API_URL } from "../../../data/api";

const useClientsByTypeDistribution = () => {
  const { authToken } = useAuth();
  const [distribution, setDistribution] = useState([]); // Array of { name: string, count: number }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDistribution = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDistribution([]);

    if (!authToken) {
      setError("Autenticazione necessaria per la distribuzione clienti per tipologia.");
      setLoading(false);
      return;
    }

    try {
      // Fetch all client types, and populate their associated clients
      const queryParams = {
        populate: {
          clientes: { // Assuming 'clientes' is the relation name to Client in TipologiaCliente
            fields: ["id"], // Only need client ID to count
          },
        },
        fields: ["nome"], // Only need the name of the client type
        pagination: { pageSize: 10000 }, // Fetch all client types
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/tipologia-clientes?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch client type distribution: ${response.statusText}`);
      }

      const data = await response.json();
      const clientTypesData = data.data;

      const calculatedDistribution = clientTypesData.map(type => ({
        name: type.nome,
        count: type.clientes?.length || 0, // Count clients associated with this type
      }));

      setDistribution(calculatedDistribution);

    } catch (err) {
      console.error("Error fetching client type distribution:", err);
      setError(err.message);
      setDistribution([]);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchDistribution();
  }, [fetchDistribution]);

  return { distribution, loading, error, refetch: fetchDistribution };
};

export default useClientsByTypeDistribution;