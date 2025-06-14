// src/hooks/stats/useAvgClientsPerPromotion.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../../../data/api";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { useAuth } from "../../authContext";

const useAvgClientsPerPromotion = () => {
  const { authToken } = useAuth();
  const [avgClients, setAvgClients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAvgClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAvgClients(0);

    if (!authToken) {
      setError("Autenticazione necessaria per i clienti medi per promozione.");
      setLoading(false);
      return;
    }

    try {
      // Fetch all promotions with their associated client types and their clients
      const queryParams = {
        populate: {
          tipologia_clientes: {
            populate: {
              clientes: {
                fields: ["id"], // Only need client ID to count unique clients
              },
            },
            fields: ["id"], // Minimal fields for client type itself
          },
        },
        fields: ["id"], // Minimal field for promotion itself
        pagination: { pageSize: 100000 },
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/promoziones?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch avg clients per promotion: ${response.statusText}`);
      }

      const data = await response.json();
      const promotions = data.data || [];

      let totalUniqueClientsAcrossPromotions = 0;
      let totalPromotionsWithClients = 0;

      promotions.forEach(promo => {
        const uniqueClientsForThisPromo = new Set();
        if (promo.tipologia_clientes) {
          promo.tipologia_clientes.forEach(clientType => {
            if (clientType.clientes) {
              clientType.clientes.forEach(client => {
                uniqueClientsForThisPromo.add(client.id);
              });
            }
          });
        }
        if (uniqueClientsForThisPromo.size > 0) {
            totalUniqueClientsAcrossPromotions += uniqueClientsForThisPromo.size;
            totalPromotionsWithClients++;
        }
      });

      const calculatedAvg = totalPromotionsWithClients > 0
        ? totalUniqueClientsAcrossPromotions / totalPromotionsWithClients
        : 0;

      setAvgClients(calculatedAvg);

    } catch (err) {
      console.error("Error fetching average clients per promotion:", err);
      setError(err.message);
      setAvgClients(0);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchAvgClients();
  }, [fetchAvgClients]);

  return { avgClients, loading, error, refetch: fetchAvgClients };
};

export default useAvgClientsPerPromotion;