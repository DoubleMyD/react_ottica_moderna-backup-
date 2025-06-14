// src/hooks/stats/SinglePromotionStatsHooks/usePromotionClientsReached.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../../../data/api"; // Adjust path
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { useAuth } from "../../authContext"; // Adjust path

const usePromotionClientsReached = (promotionId) => {
  const { authToken } = useAuth();
  const [totalClientsReached, setTotalClientsReached] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClientsReached = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTotalClientsReached(0);

    if (!authToken) {
      setError("Autenticazione necessaria per i clienti raggiunti dalla promozione.");
      setLoading(false);
      return;
    }

    if (!promotionId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch the specific promotion and populate its client types and their clients
      const queryParams = {
        filters: {
          id: {
            $eq: promotionId,
          },
        },
        populate: {
          tipologia_clientes: {
            populate: {
              clientes: {
                fields: ["id"], // Only need client ID to count unique clients
              },
            },
            fields: ["id"], // Minimal field for client type itself
          },
        },
        fields: ["id"], // Minimal field for promotion itself
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/promoziones?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch clients reached for promotion ${promotionId}: ${response.statusText}`);
      }

      const data = await response.json();
      const promotionData = data.data?.[0]; // Get the single promotion object

      const uniqueClients = new Set();
      if (promotionData && promotionData.tipologia_clientes) {
        promotionData.tipologia_clientes.forEach(clientType => {
          if (clientType.clientes) {
            clientType.clientes.forEach(client => {
              uniqueClients.add(client.id);
            });
          }
        });
      }
      setTotalClientsReached(uniqueClients.size);

    } catch (err) {
      console.error(`Error fetching clients reached for promotion ${promotionId}:`, err);
      setError(err.message);
      setTotalClientsReached(0);
    } finally {
      setLoading(false);
    }
  }, [authToken, promotionId]);

  useEffect(() => {
    fetchClientsReached();
  }, [fetchClientsReached]);

  return { totalClientsReached, loading, error, refetch: fetchClientsReached };
};

export default usePromotionClientsReached;