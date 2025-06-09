// src/hooks/useProductFAQs.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api"; // Ensure this path is correct
import { buildQueryStringV5 } from "../utils/buildQueryString"; // Reusing your existing utility

/**
 * Custom hook to fetch FAQs related to a specific product.
 * Filters FAQs based on their 'prodottos' relation to the given productId.
 * Designed for Strapi v5's flattened data structure.
 *
 * @param {string} productDocumentId - The ID of the product for which to fetch FAQs.
 * @returns {object} An object containing:
 * - faqs: An array of FAQ objects (Strapi v5 format: id, domanda, risposta, data).
 * - loading: A boolean indicating if FAQs are currently being fetched.
 * - error: An error object or null if no error occurred.
 * - refetchFAQs: A function to manually re-trigger the FAQs fetch.
 */
const useProductFAQs = (productDocumentId) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFAQs = useCallback(async () => {
    if (!productDocumentId) {
      setFaqs([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const queryParams = {
        filters: {
          // Filter FAQ entries where their 'prodottos' relation contains the current productId
          // 'prodottos' is the relation field name on your 'FAQ' content type linking to 'Prodotto'.
          prodottos: {
            documentId: {
              $eq: productDocumentId,
            },
          },
        },
        // Explicitly request the fields you need from the FAQ entry itself.
        fields: ["domanda", "risposta", "data"],
        // You might want to sort the FAQs, e.g., by their 'data' field or manually
        sort: ["data:asc"], // Sort by creation/update date, adjust as needed
      };

      const queryString = buildQueryStringV5(queryParams);

      // Query the 'faqs' endpoint
      const response = await fetch(
        `${STRAPI_BASE_API_URL}/faqs?${queryString}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch FAQs: ${response.statusText}`);
      }

      const data = await response.json();
      // Strapi v5 collection responses typically return a 'data' array at the top level,
      // with individual items inside being flattened (no 'attributes' wrapper).
      setFaqs(data.data || []);
    } catch (err) {
      console.error("Error fetching product FAQs:", err);
      setError(err.message);
      setFaqs([]); // Ensure FAQs are empty on error
    } finally {
      setLoading(false);
    }
  }, [productDocumentId]); // Re-run effect if the productId changes

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]); // Depend on the memoized fetchFAQs function

  return { faqs, loading, error, refetchFAQs: fetchFAQs };
};

export default useProductFAQs;
