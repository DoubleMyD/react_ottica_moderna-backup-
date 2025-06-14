// src/hooks/stats/useTopContributingBrand.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../authContext";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { STRAPI_BASE_API_URL } from "../../../data/api";

const useTopContributingBrand = () => {
  const { authToken } = useAuth();
  const [topBrand, setTopBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopBrand = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTopBrand(null);

    if (!authToken) {
      setError("Autenticazione necessaria per il brand con maggior contributo.");
      setLoading(false);
      return;
    }

    try {
      // Fetch all dettaglio_acquistos with product and its brand
      const queryParams = {
        populate: {
          prodotto: {
            fields: ["brand"], // Only need product brand
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
        throw new Error(errorData.error?.message || `Failed to fetch top contributing brand data: ${response.statusText}`);
      }

      const data = await response.json();
      const brandRevenue = new Map(); // Map: brandName -> totalRevenue

      data.data.forEach(item => {
        const productBrand = item.prodotto?.brand; // Access product brand
        const quantity = item.quantita || 0;
        const unitPrice = item.prezzo_unitario_scontato || item.prezzo_unitario_originale || 0;
        const revenue = quantity * unitPrice;

        if (productBrand) {
          brandRevenue.set(productBrand, (brandRevenue.get(productBrand) || 0) + revenue);
        }
      });

      let topBrandName = null;
      let maxRevenue = 0;

      brandRevenue.forEach((revenue, brand) => {
        if (revenue > maxRevenue) {
          maxRevenue = revenue;
          topBrandName = brand;
        }
      });

      if (topBrandName) {
        setTopBrand({ name: topBrandName, totalRevenue: maxRevenue });
      } else {
        setTopBrand(null); // No data
      }

    } catch (err) {
      console.error("Error fetching top contributing brand:", err);
      setError(err.message);
      setTopBrand(null);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchTopBrand();
  }, [fetchTopBrand]);

  return { topBrand, loading, error, refetch: fetchTopBrand };
};

export default useTopContributingBrand;