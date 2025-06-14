// src/hooks/useClientTypes.js
import { useState, useEffect } from "react";

import { STRAPI_BASE_API_URL } from "../data/api"; // Ensure this path is correct
import { buildQueryStringV5 } from "../utils/buildQueryString";
import { useAuth } from "./authContext";

const useClientTypes = () => {
  const [clientTypes, setClientTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authToken } = useAuth();

  useEffect(() => {
    const fetchClientTypes = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = {
          populate: {
            promoziones: {
              fields: ["titolo", "descrizione", "data_inizio", "data_fine"],
            },
            // <--- Combined both populates into one object
            clientes: {
              fields: ["nome", "cognome"], // Added cognome and email for full client display
            },
          },
          fields: ["nome", "descrizione", "tratti_caratteristici", "documentId", "id"],
          pagination: { pageSize: 100000 },
        };
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
            ...item, // <--- This ensures promoziones and clientes are directly accessible
          }))
        );
      } catch (e) {
        console.error("Error fetching client types:", e);
        setError("Impossibile caricare le tipologie di cliente.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientTypes();
    // Dependency array to ensure effect runs only once or when authToken changes
  }, [authToken]); // Include authToken as a dependency

  return { clientTypes, loading, error };
};

export default useClientTypes;
