// src/hooks/useReviews.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api";
import { buildQueryStringV5 } from "../utils/buildQueryString";

/**
 * Custom hook to fetch all reviews from Strapi.
 * Populates related 'cliente' and 'prodotto' data.
 * Designed for Strapi v5's flattened data structure.
 *
 * @returns {object} An object containing:
 * - reviews: An array of review objects (Strapi v5 format).
 * - loading: A boolean indicating if reviews are currently being fetched.
 * - error: An error object or null if no error occurred.
 * - refetchReviews: A function to manually re-trigger the reviews fetch.
 */
const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const queryParams = {
        populate: {
          // Populate the 'cliente' relation to get user details
          cliente: {
            // Assuming 'nome' is the field for the client's name. Adjust if different.
            fields: ["nome", "cognome"],
          },
          // Populate the 'prodotto' relation to get product details (especially image and ID)
          prodotto: {
            fields: ["nome"], // Get product name for alt text
            populate: {
              immagine: {
                // Populate image on product
                fields: ["url", "name"],
              },
            },
          },
        },
        // Explicitly request the direct fields for review.
        // In v5, often not strictly needed if populate is also used, but good for clarity.
        fields: ["stelle", "data", "titolo", "descrizione"],
        sort: ["data:desc"], // Sort by date, newest first
      };

      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(
        `${STRAPI_BASE_API_URL}/recensiones?${queryString}` // Assuming 'recensiones' is your plural endpoint
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Reviews : " , data);
      // Strapi v5 collection responses still use a 'data' array wrapper.
      setReviews(data.data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.message);
      setReviews([]); // Ensure reviews are empty on error
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies, as it fetches all reviews

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, refetchReviews: fetchReviews };
};

export default useReviews;
