// src/hooks/useTotalRevenue.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../../../data/api";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { useAuth } from "../../authContext"; // Assuming authContext is available

const useTotalRevenue = () => {
  const { authToken } = useAuth();
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRevenue = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTotalRevenue(0);

    if (!authToken) {
      setError("Autenticazione necessaria per il ricavo totale.");
      setLoading(false);
      return;
    }

    try {
      const queryParams = {
        fields: ["prezzo_totale"], // Only need the total price field
        pagination: { pageSize: 100000 }, // Fetch all records for accurate sum
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(
        `${STRAPI_BASE_API_URL}/acquistos?${queryString}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message ||
            `Failed to fetch total revenue: ${response.statusText}`
        );
      }

      const data = await response.json();
      const sumRevenue = data.data.reduce(
        (sum, item) => sum + (item.prezzo_totale || 0),
        0
      );
      setTotalRevenue(sumRevenue);
    } catch (err) {
      console.error("Error fetching total revenue:", err);
      setError(err.message);
      setTotalRevenue(0);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  return { totalRevenue, loading, error, refetch: fetchRevenue };
};

export default useTotalRevenue;
