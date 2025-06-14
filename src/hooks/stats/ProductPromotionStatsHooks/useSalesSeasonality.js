// src/hooks/stats/useSalesSeasonality.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../authContext";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { STRAPI_BASE_API_URL } from "../../../data/api";

const useSalesSeasonality = () => {
  const { authToken } = useAuth();
  const [seasonalityData, setSeasonalityData] = useState([]); // [{ season: 'Estate', totalRevenue: 1234.50 }]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSeason = (date) => {
    const month = date.getMonth(); // 0-11
    if (month >= 2 && month <= 4) return "Primavera"; // March, April, May
    if (month >= 5 && month <= 7) return "Estate";    // June, July, August
    if (month >= 8 && month <= 10) return "Autunno";  // September, October, November
    return "Inverno"; // December, January, February
  };

  const fetchSeasonality = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSeasonalityData([]);

    if (!authToken) {
      setError("Autenticazione necessaria per la stagionalità delle vendite.");
      setLoading(false);
      return;
    }

    try {
      // Fetch all purchases with date and total price
      const queryParams = {
        fields: ["data", "prezzo_totale"],
        pagination: { pageSize: 100000 },
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/acquistos?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch sales seasonality data: ${response.statusText}`);
      }

      const data = await response.json();
      const seasonalRevenue = new Map(); // Map: seasonName -> totalRevenue

      data.data.forEach(item => {
        const purchaseDate = new Date(item.data);
        const season = getSeason(purchaseDate);
        const revenue = item.prezzo_totale || 0;

        seasonalRevenue.set(season, (seasonalRevenue.get(season) || 0) + revenue);
      });

      // Convert map to array and sort for consistent display (e.g., by fixed season order)
      const orderedSeasons = ["Inverno", "Primavera", "Estate", "Autunno"];
      const formattedSeasonality = orderedSeasons.map(season => ({
        season: season,
        totalRevenue: seasonalRevenue.get(season) || 0,
      }));

      setSeasonalityData(formattedSeasonality);

    } catch (err) {
      console.error("Error fetching sales seasonality:", err);
      setError(err.message);
      setSeasonalityData([]);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchSeasonality();
  }, [fetchSeasonality]);

  return { seasonalityData, loading, error, refetch: fetchSeasonality };
};

export default useSalesSeasonality;