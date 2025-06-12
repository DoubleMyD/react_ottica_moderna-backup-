// src/hooks/usePromotions.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api"; // Ensure this path is correct
import { buildQueryStringV5 } from "../utils/buildQueryString"; // Reusing your existing utility
import { useAuth } from "./authContext";

/**
 * Custom hook to fetch all promotions from Strapi.
 * Designed for Strapi v5's flattened data structure.
 *
 * @returns {object} An object containing:
 * - promotions: An array of promotion objects (Strapi v5 format).
 * - loading: A boolean indicating if promotions are currently being fetched.
 * - error: An error object or null if no error occurred.
 * - refetchPromotions: A function to manually re-trigger the promotions fetch.
 */
const usePromotions = () => {
  const  {authToken} = useAuth();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllPromotions = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const queryParams = {
        populate: {
          tipologia_clientes: {
            populate: {
              clientes: {
                fields: ["*"],
              },
            },
            fields: ["nome", "descrizione", "tratti_caratteristici"],
          },
        },
        // Explicitly request the fields you need for promotion.
        fields: ["titolo", "descrizione", "data_inizio", "data_fine", "documentId"], // Assuming 'status' for STATO
        sort: ["data_inizio:desc"], // Sort by start date, newest first
      };

      const queryString = buildQueryStringV5(queryParams);
      // Query the 'promoziones' endpoint (plural of 'promozione')
      const response = await fetch(
        `${STRAPI_BASE_API_URL}/promoziones?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch promotions: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Promotions: " , data);
      // Strapi v5 collection responses typically return a 'data' array at the top level,
      // with individual items inside being flattened (no 'attributes' wrapper).
      setPromotions(data.data || []);
    } catch (err) {
      console.error("Error fetching all promotions:", err);
      setError(err.message);
      setPromotions([]); // Ensure promotions are empty on error
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies, as it fetches all promotions

  useEffect(() => {
    fetchAllPromotions();
  }, [fetchAllPromotions]);

  return { promotions, loading, error, refetchPromotions: fetchAllPromotions };
};

export default usePromotions;
