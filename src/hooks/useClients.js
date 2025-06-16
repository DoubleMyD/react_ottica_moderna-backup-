// src/hooks/useClients.js
import { useState, useEffect, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api";
import { buildQueryStringV5 } from "../utils/buildQueryString"; // Assuming this utility exists
import { useAuth } from "./authContext";

/**
 * Custom hook to fetch client data from Strapi with search and filter capabilities.
 * Populates related 'user' (for email) and 'tipologia_clientes' data.
 * Designed for Strapi v5's flattened data structure.
 *
 * @param {object} filterOptions - An object containing filtering criteria.
 * @param {string} [filterOptions.searchTerm=""] - Optional search term to filter clients by text fields (name, surname, email, address, city, nationality, client type name).
 * @param {string} [filterOptions.clientType=""] - Optional client type name to filter clients by their associated tipologia_cliente.
 * @returns {object} An object containing:
 * - clients: An array of client objects.
 * - loading: A boolean indicating if clients are currently being fetched.
 * - error: An error object or null if no error occurred.
 * - refetchClients: A function to manually re-trigger the client fetch.
 */
const useClients = (filterOptions = {}) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken } = useAuth();

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!authToken) {
      setError("Autenticazione necessaria per visualizzare i clienti.");
      setLoading(false);
      return;
    }

    try {
      const { searchTerm = "", clientType = "" } = filterOptions;

      const queryParams = {
        populate: {
          user: {
            fields: ["username", "email", "documentId"],
          },
          tipologia_clientes: {
            fields: ["nome", "id", "documentId"], // Populate 'id', 'nome', and 'documentId' for client types
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
          "documentId", // Ensure documentId is fetched at the top level
          "id" // Ensure id is fetched at the top level
        ],
        pagination: { pageSize: 100000 },
      };

      const filters = [];

      // Add general search term filters across multiple fields
      if (searchTerm) {
        filters.push({
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
          ],
        });
      }

      // Add client type specific filter
      if (clientType) {
        filters.push({
          tipologia_clientes: {
            nome: { $eq: clientType }, // Filter clients who are associated with a client type of this name
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
      console.log(`Fetching clients with query: ${queryString}`); // Log the full query

      const response = await fetch(`${STRAPI_BASE_API_URL}/clientes?${queryString}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

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
        const clientAttributes = item; // Access attributes for the main client data

        // Ensure tipologia_clientes is an array of plain objects with id, nome, and documentId
        const tipologie =
          item.tipologia_clientes?.map((tc) => ({ // Ensure .data is accessed for relations
            id: tc.id,
            documentId: tc.documentId,
            nome: tc.nome,
          })) || [];

        return {
          id: item.id, // Strapi ID
          documentId: clientAttributes.documentId, // Your custom documentId
          nome: clientAttributes.nome,
          cognome: clientAttributes.cognome,
          data_nascita: clientAttributes.data_nascita,
          indirizzo: clientAttributes.indirizzo,
          citta: clientAttributes.citta,
          cap: clientAttributes.cap,
          nazionalita: clientAttributes.nazionalita,
          iscrizione_newsletter: clientAttributes.iscrizione_newsletter,
          user: clientAttributes.user || null, // Flatten user attributes
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
  }, [authToken, filterOptions]); // Re-fetch if authToken or filterOptions changes

  useEffect(() => {
    fetchClients();
  }, [fetchClients]); // Effect depends on the memoized fetchClients

  return { clients, loading, error, refetchClients: fetchClients };
};

export default useClients;