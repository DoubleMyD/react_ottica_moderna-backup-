// src/hooks/stats/SinglePromotionStatsHooks/useMostActiveClientTypeForPromotion.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../../../data/api"; // Adjust path
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { useAuth } from "../../authContext"; // Adjust path

const useMostActiveClientTypeForPromotion = (promotionId) => {
  const { authToken } = useAuth();
  const [mostActiveType, setMostActiveType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMostActiveType = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMostActiveType(null);

    if (!authToken) {
      setError("Autenticazione necessaria per la tipologia cliente più attiva per promozione.");
      setLoading(false);
      return;
    }

    if (!promotionId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch all cliente_promoziones records for THIS promotion,
      // and populate the client, and the client's client types.
      const queryParams = {
        filters: {
          promozione: {
            id: {
              $eq: promotionId,
            },
          },
          data_utilizzo: { // Only count usage for 'most active'
              $notNull: true
          }
        },
        populate: {
          cliente: {
            populate: {
              tipologia_clientes: { // Client's associated client types
                fields: ["nome"],
              },
            },
            fields: ["id"], // Minimal client fields
          },
        },
        fields: ["id"], // Minimal cliente_promozione fields
        pagination: { pageSize: 100000 },
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(
        `${STRAPI_BASE_API_URL}/storico-promozionis?${queryString}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new new Error(errorData.error?.message || `Failed to fetch client types for promotion ${promotionId}: ${response.statusText}`);
      }

      const data = await response.json();
      const usageRecords = data.data || [];

      const clientTypeUsageCount = new Map(); // Map: clientTypeName -> count of usages

      usageRecords.forEach(record => {
        const client = record.cliente;
        if (client && client.tipologia_clientes) {
          client.tipologia_clientes.forEach(clientType => {
            if (clientType.nome) {
              clientTypeUsageCount.set(clientType.nome, (clientTypeUsageCount.get(clientType.nome) || 0) + 1);
            }
          });
        }
      });

      let topTypeName = null;
      let maxUsageCount = -1;

      clientTypeUsageCount.forEach((count, typeName) => {
        if (count > maxUsageCount) {
          maxUsageCount = count;
          topTypeName = typeName;
        }
      });

      if (topTypeName) {
        setMostActiveType({ name: topTypeName, usageCount: maxUsageCount });
      } else {
        setMostActiveType(null);
      }

    } catch (err) {
      console.error(`Error fetching most active client type for promotion ${promotionId}:`, err);
      setError(err.message);
      setMostActiveType(null);
    } finally {
      setLoading(false);
    }
  }, [authToken, promotionId]);

  useEffect(() => {
    fetchMostActiveType();
  }, [fetchMostActiveType]);

  return { mostActiveType, loading, error, refetch: fetchMostActiveType };
};

export default useMostActiveClientTypeForPromotion;