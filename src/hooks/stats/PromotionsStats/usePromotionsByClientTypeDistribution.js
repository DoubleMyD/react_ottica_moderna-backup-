// src/hooks/stats/usePromotionsByClientTypeDistribution.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../../../data/api";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { useAuth } from "../../authContext";

const usePromotionsByClientTypeDistribution = () => {
  const { authToken } = useAuth();
  const [distribution, setDistribution] = useState([]); // [{ type: 'Nome Tipologia', count: 5 }]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDistribution = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDistribution([]);

    if (!authToken) {
      setError("Autenticazione necessaria per la distribuzione promozioni per tipologia cliente.");
      setLoading(false);
      return;
    }

    try {
      // Fetch all client types and their associated promotions
      const queryParams = {
        populate: {
          promoziones: { // Assuming 'promoziones' is the relation name to Promozione in TipologiaCliente
            fields: ["id"], // Only need promotion ID to count
          },
        },
        fields: ["nome"], // Only need the name of the client type
        pagination: { pageSize: 10000 },
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/tipologia-clientes?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch promotion distribution by client type: ${response.statusText}`);
      }

      const data = await response.json();
      const clientTypesData = data.data || [];

      const calculatedDistribution = clientTypesData.map(type => ({
        type: type.nome,
        count: type.promoziones?.length || 0, // Count promotions associated with this client type
      }));

      // Sort by count descending, then by type name for consistency
      calculatedDistribution.sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));

      setDistribution(calculatedDistribution);

    } catch (err) {
      console.error("Error fetching promotion distribution by client type:", err);
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

export default usePromotionsByClientTypeDistribution;