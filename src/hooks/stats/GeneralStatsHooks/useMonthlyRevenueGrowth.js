// src/hooks/useMonthlyRevenueGrowth.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../authContext";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { STRAPI_BASE_API_URL } from "../../../data/api";

const useMonthlyRevenueGrowth = () => {
  const { authToken } = useAuth();
  const [growthPercentage, setGrowthPercentage] = useState(0);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [prevMonthRevenue, setPrevMonthRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMonthlyRevenue = useCallback(async () => {
    setLoading(true);
    setError(null);
    setGrowthPercentage(0);
    setCurrentMonthRevenue(0);
    setPrevMonthRevenue(0);

    if (!authToken) {
      setError("Autenticazione necessaria per la crescita ricavo mensile.");
      setLoading(false);
      return;
    }

    try {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Calculate previous month and year
      let prevMonth = currentMonth - 1;
      let prevYear = currentYear;
      if (prevMonth < 0) {
        prevMonth = 11; // December
        prevYear -= 1;
      }

      // Format dates for Strapi filters (ISO strings)
      // Current month: from 1st of current month to end of current month (or now)
      const startCurrentMonth = new Date(currentYear, currentMonth, 1).toISOString();
      const endCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999).toISOString(); // Last day of current month

      // Previous month: from 1st of previous month to end of previous month
      const startPrevMonth = new Date(prevYear, prevMonth, 1).toISOString();
      const endPrevMonth = new Date(prevYear, prevMonth + 1, 0, 23, 59, 59, 999).toISOString(); // Last day of previous month

      const queryParams = {
        fields: ["prezzo_totale", "data"],
        pagination: { pageSize: 100000 },
        // Fetching all relevant data first, then filtering locally for months
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(`${STRAPI_BASE_API_URL}/acquistos?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to fetch monthly revenue data: ${response.statusText}`);
      }

      const data = await response.json();
      let revenueCurrent = 0;
      let revenuePrev = 0;

      data.data.forEach(item => {
        const purchaseDate = new Date(item.data);
        if (purchaseDate >= new Date(startCurrentMonth) && purchaseDate <= new Date(endCurrentMonth)) {
          revenueCurrent += (item.prezzo_totale || 0);
        } else if (purchaseDate >= new Date(startPrevMonth) && purchaseDate <= new Date(endPrevMonth)) {
          revenuePrev += (item.prezzo_totale || 0);
        }
      });

      setCurrentMonthRevenue(revenueCurrent);
      setPrevMonthRevenue(revenuePrev);

      let growth = 0;
      if (revenuePrev > 0) {
        growth = (revenueCurrent - revenuePrev) / revenuePrev;
      } else if (revenueCurrent > 0 && revenuePrev === 0) {
        growth = 1; // Infinite growth from zero, represent as 100% or very high for display
      }
      setGrowthPercentage(growth);

    } catch (err) {
      console.error("Error fetching monthly revenue growth:", err);
      setError(err.message);
      setGrowthPercentage(0);
      setCurrentMonthRevenue(0);
      setPrevMonthRevenue(0);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchMonthlyRevenue();
  }, [fetchMonthlyRevenue]);

  return { growthPercentage, currentMonthRevenue, prevMonthRevenue, loading, error, refetch: fetchMonthlyRevenue };
};

export default useMonthlyRevenueGrowth;