// src/hooks/stats/useMostProfitableProductType.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../authContext";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { STRAPI_BASE_API_URL } from "../../../data/api";

const useMostProfitableProductType = () => {
  const { authToken } = useAuth();
  const [mostProfitableType, setMostProfitableType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMostProfitableType = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMostProfitableType(null);

    if (!authToken) {
      setError("Autenticazione necessaria per la tipologia di prodotto più redditizia.");
      setLoading(false);
      return;
    }

    try {
      // Fetch all dettaglio_acquistos with product and its typology
      const queryParams = {
        populate: {
          prodotto: {
            fields: ["tipologia"], // Only need product typology
          },
        },
        fields: ["quantita", "prezzo_unitario_scontato", "prezzo_unitario_originale"], // Quantity and price info
        pagination: { pageSize: 100000 },
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/dettaglio-acquistos?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch most profitable product type data: ${response.statusText}`);
      }

      const data = await response.json();
      const typeRevenue = new Map(); // Map: productType -> totalRevenue

      data.data.forEach(item => {
        const productType = item.prodotto?.tipologia; // Access product typology
        const quantity = item.quantita || 0;
        // Assume prezzo_unitario_scontato if available, else original
        const unitPrice = item.prezzo_unitario_scontato || item.prezzo_unitario_originale || 0;
        const revenue = quantity * unitPrice;

        if (productType) {
          typeRevenue.set(productType, (typeRevenue.get(productType) || 0) + revenue);
        }
      });

      let topType = null;
      let maxRevenue = 0;

      typeRevenue.forEach((revenue, type) => {
        if (revenue > maxRevenue) {
          maxRevenue = revenue;
          topType = type;
        }
      });

      if (topType) {
        setMostProfitableType({ name: topType, totalRevenue: maxRevenue });
      } else {
        setMostProfitableType(null); // No data
      }

    } catch (err) {
      console.error("Error fetching most profitable product type:", err);
      setError(err.message);
      setMostProfitableType(null);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchMostProfitableType();
  }, [fetchMostProfitableType]);

  return { mostProfitableType, loading, error, refetch: fetchMostProfitableType };
};

export default useMostProfitableProductType;