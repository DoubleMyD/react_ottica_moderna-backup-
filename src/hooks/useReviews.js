// src/hooks/useReviews.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api";
import { buildQueryStringV5 } from "../utils/buildQueryString";

/**
 * Custom hook to fetch all reviews from Strapi.
 * Populates related 'cliente' and 'prodotto' data.
 * Designed for Strapi v5's flattened data structure.
 *
 * @param {boolean} [onlyGeneralReview=false] - If true, fetches reviews NOT associated with any product.
 * @returns {object} An object containing:
 * - reviews: An array of review objects (Strapi v5 format).
 * - loading: A boolean indicating if reviews are currently being fetched.
 * - error: An error object or null if no error occurred.
 * - refetchReviews: A function to manually re-trigger the reviews fetch.
 */
const useReviews = (productId, generalReview) => {
  // Added onlyGeneralFaqs parameter with default
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const queryParams = {
        populate: {
          cliente: {
            fields: ["nome", "cognome"],
          },
          prodotto: {
            fields: ["nome", "id", "documentId"],
            populate: {
              immagine: {
                fields: ["url", "name"],
              },
            },
          },
        },
        fields: ["stelle", "data", "titolo", "descrizione"],
        sort: ["data:desc"],
      };

      // Add these lines to debug
      console.log("Type of productId:", typeof productId);
      console.log("Value of productId:", productId);
      
      // NEW: Conditionally add filter for 'prodotto' relation being null
      if (generalReview === true) {
        queryParams.filters = {
          prodotto: {
            id: {
              $null: true, // Filters where the 'prodotto' relation is not set
            },
          },
        };
      } else if(productId !== null){
        queryParams.filters = {
          prodotto: {
            id: {
              $eq: productId, // Filters where the 'prodotto' relation is equal to productId
            },
          },
        };
      }

      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(
        `${STRAPI_BASE_API_URL}/recensiones?${queryString}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Reviews : ", data);

      setReviews(data.data || data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.message);
      setReviews([]); // Ensure reviews are empty on error
    } finally {
      setLoading(false);
    }
  }, [productId]); // Dependency added: fetchReviews now re-runs when onlyGeneralFaqs changes

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]); // Dependency for useEffect

  return { reviews, loading, error, refetchReviews: fetchReviews };
};

export default useReviews;
