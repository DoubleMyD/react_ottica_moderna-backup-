// src/hooks/useGeneralFAQs.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api"; // Ensure this path is correct
import { buildQueryStringV5 } from "../utils/buildQueryString"; // Reusing your existing utility

/**
 * Custom hook to fetch general FAQs from Strapi, i.e., those not associated with any product.
 * Filters FAQs where the 'prodottos' relation is null/empty.
 * Designed for Strapi v5's flattened data structure.
 *
 * @returns {object} An object containing:
 * - faqs: An array of general FAQ objects (Strapi v5 format: id, domanda, risposta, data).
 * - loading: A boolean indicating if FAQs are currently being fetched.
 * - error: An error object or null if no error occurred.
 * - refetchFAQs: A function to manually re-trigger the FAQs fetch.
 */
const useGeneralFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGeneralFAQs = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const queryParams = {
        filters: {
          // Filter FAQ entries where the 'prodottos' relation is null.
          // In Strapi, for relations, checking for $null is the correct way to find unlinked entries.
          prodottos: {
            $null: true,
          },
        },
        // Explicitly request the fields you need from the FAQ entry itself.
        fields: ["domanda", "risposta", "data"],
        sort: ["data:asc"], // Sort by date, adjust as needed
      };

      const queryString = buildQueryStringV5(queryParams);

      // Query the 'faqs' endpoint
      const response = await fetch(
        `${STRAPI_BASE_API_URL}/faqs?${queryString}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch general FAQs: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("General Faqs: ", faqs);
      setFaqs(data.data || []);
    } catch (err) {
      console.error("Error fetching general FAQs:", err);
      setError(err.message);
      setFaqs([]); // Ensure FAQs are empty on error
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies, as it fetches general FAQs once on mount

  useEffect(() => {
    fetchGeneralFAQs();
  }, [fetchGeneralFAQs]); // Depend on the memoized fetchGeneralFAQs function

  return { faqs, loading, error, refetchFAQs: fetchGeneralFAQs };
};

export default useGeneralFAQs;
