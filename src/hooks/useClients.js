// src/hooks/useClients.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api";
import { buildQueryStringV5 } from "../utils/buildQueryString"; // Assuming this utility exists
import { useAuth } from "./authContext";

/**
 * Custom hook to fetch all client data from Strapi.
 * Populates related 'user' (for email) and 'tipologia_clientes' data.
 * Designed for Strapi v5's flattened data structure.
 *
 * @param {string} searchTerm - Optional search term to filter clients by any text field.
 * @returns {object} An object containing:
 * - clients: An array of client objects.
 * - loading: A boolean indicating if clients are currently being fetched.
 * - error: An error object or null if no error occurred.
 * - refetchClients: A function to manually re-trigger the client fetch.
 */
const useClients = (searchTerm = "") => {
  // Accept searchTerm as a parameter
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken } = useAuth();

  const fetchAllClients = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!authToken) {
      setError("Autenticazione necessaria per visualizzare i clienti.");
      setLoading(false);
      return;
    }

    try {
      const queryParams = {
        populate: {
          user: {
            fields: ["username", "email", "documentId" ],
          },
          tipologia_clientes: {
            fields: ["nome", "id"], // Populate 'id' and 'nome' for client types
          },
        },
        fields: [
          "nome",
          "cognome",
          "data_nascita",
          "indirizzo",
          "citta",
          "cap",
          "nazionalita",
          "iscrizione_newsletter",
        ],
        pagination: { pageSize: 100000 },
      };

      // Implement search filter
      if (searchTerm) {
        queryParams.filters = {
          $or: [
            { nome: { $containsi: searchTerm } },
            { cognome: { $containsi: searchTerm } },
            { indirizzo: { $containsi: searchTerm } },
            { citta: { $containsi: searchTerm } },
            { nazionalita: { $containsi: searchTerm } },
            // Search in related user's email
            { user: { email: { $containsi: searchTerm } } },
            // Search in related tipologia_clientes names
            { tipologia_clientes: { nome: { $containsi: searchTerm } } },
            // For date and number fields, you might need to convert searchTerm to appropriate type
            // This example only handles text-based contains.
            // { data_nascita: { $containsi: searchTerm } }, // Date as string
            // { cap: { $eq: parseInt(searchTerm) || -1 } }, // Number exact match
          ],
        };
      }

      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(
        `${STRAPI_BASE_API_URL}/clientes?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Non autorizzato. Effettua il login come amministratore."
          );
        }
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message ||
            `Failed to fetch clients: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Raw response Clients:", data);

      // Map data to flatten attributes and handle relations for v5
      const mappedClients = data.data.map((item) => {
        const clientAttributes = item;

        // Ensure tipologia_clientes is an array of plain objects with id and nome
        const tipologie =
          clientAttributes.tipologia_clientes?.map((tc) => ({
            id: tc.id,
            nome: tc.nome,
          })) || [];

        return {
          id: item.id,
          ...clientAttributes,
          user: clientAttributes.user, // Flatten user attributes
          tipologia_clientes: tipologie, // Assign the flattened tipologie
        };
      });
      setClients(mappedClients);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(err.message);
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [authToken, searchTerm]); // Re-fetch if authToken or searchTerm changes

  useEffect(() => {
    fetchAllClients();
  }, [fetchAllClients]);

  return { clients, loading, error, refetchClients: fetchAllClients };
};

export default useClients;
