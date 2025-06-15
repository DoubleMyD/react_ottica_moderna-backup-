// src/hooks/useClientTypes.js
import { useState, useEffect, useCallback } from "react"; // Import useCallback

import { STRAPI_BASE_API_URL } from "../data/api"; // Ensure this path is correct
import { buildQueryStringV5 } from "../utils/buildQueryString";
import { useAuth } from "./authContext";

const useClientTypes = (filterOptions = {}) => {
  const [clientTypes, setClientTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authToken } = useAuth();

  // Wrap fetchClientTypes in useCallback to memoize it.
  // This prevents unnecessary re-renders in consuming components
  // if fetchClientTypes is passed as a dependency to other effects.
  const fetchClientTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { searchTerm = "", productDocumentId = "" } = filterOptions; // Destructure new filter options

      const queryParams = {
        populate: {
          promoziones: {
            fields: ["titolo", "descrizione", "data_inizio", "data_fine"],
          },
          clientes: {
            fields: ["nome", "cognome"],
          },
          prodottos: {
            populate: {
              immagine: {
                fields: ["name", "alternativeText", "width", "height", "url"],
              },
            },
            fields: [
              "nome",
              "descrizione",
              "brand",
              "tipologia",
              "quantita_disponibili",
              "prezzo_unitario",
              "documentId", // Added documentId to fetched fields
            ],
          },
        },
        fields: [
          "nome",
          "descrizione",
          "tratti_caratteristici",
          "documentId",
          "id",
        ],
        pagination: { pageSize: 100000 },
      };

      const filters = [];

      // Add general search term filters
      if (searchTerm) {
        filters.push({
          $or: [
            { nome: { $containsi: searchTerm } },
            { descrizione: { $containsi: searchTerm } },
            { tratti_caratteristici: { $containsi: searchTerm } },
          ],
        });
      }

      // Add product association filter
      if (productDocumentId) {
        filters.push({
          prodottos: {
            // Filter client types associated with a specific product
            documentId: { $eq: productDocumentId },
          },
        });
      }

      // Combine all filters with an $and operator if multiple exist
      if (filters.length > 0) {
        queryParams.filters = {
          $and: filters,
        };
      }

      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(
        `${STRAPI_BASE_API_URL}/tipologia-clientes?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Raw response ClientTypes : ", data);

      // Correctly map `attributes` to the top level of each client type
      setClientTypes(
        data.data.map((item) => ({
          id: item.id,
          ...item, // Correctly spread attributes here
        }))
      );
    } catch (e) {
      console.error("Error fetching client types:", e);
      setError("Impossibile caricare le tipologie di cliente.");
    } finally {
      setLoading(false);
    }
  }, [authToken, filterOptions]); // Include authToken as a dependency for useCallback

  useEffect(() => {
    // Call the memoized fetchClientTypes function when the component mounts or authToken changes
    fetchClientTypes();
  }, [fetchClientTypes]); // Dependency array to ensure effect runs when fetchClientTypes changes (which is only if authToken changes)

  return { clientTypes, loading, error, fetchClientTypes }; // Return fetchClientTypes
};

export default useClientTypes;
