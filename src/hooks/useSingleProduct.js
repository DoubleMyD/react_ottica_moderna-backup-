// src/hooks/useProduct.js
import { useState, useEffect, useCallback, useRef } from "react";
import { STRAPI_BASE_API_URL } from "../data/api";
import { buildQueryStringV5 } from "../utils/buildQueryString";
import { useAuth } from "./authContext";
import { Role } from "../data/constants";

const useSingleProduct = (productDocumentId) => {
  const { role, authToken } = useAuth();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchAllProductsForLocalFiltering = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        populate: {
          immagine: {
            fields: ["name", "alternativeText", "width", "height", "url"],
          },
          tipologia_clientes: {
            fields: [
              "nome",
              "descrizione",
              "tratti_caratteristici",
              "id",
              "documentId",
            ],
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
        pagination: { pageSize: 100000 },
      };
      const queryString = buildQueryStringV5(queryParams);

      // Dynamically create headers based on user role
      const requestHeaders = {};
      if (role === Role.ADMIN && authToken) {
        requestHeaders.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `${STRAPI_BASE_API_URL}/prodottos/${productDocumentId}?${queryString}`,
        {
          headers: requestHeaders,
        }
      );

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          errorBody.error?.message ||
            `Failed to fetch all products: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Product data", data);

      setProduct(data.data || data);
    } catch (err) {
      console.error(
        "[useProducts] Error fetching all products for local filtering:",
        err
      );
      setError(`Errore nel caricamento dei dati iniziali: ${err.message}.`);
    } finally {
      setLoading(false);
    }
  }, [refreshTrigger]); 

  // --- Effect 1: Initial fetch of ALL product data (now depends on refreshTrigger) ---
  useEffect(() => {
    fetchAllProductsForLocalFiltering();
  }, [fetchAllProductsForLocalFiltering]); // DEPENDENCY ADDED: fetchAllProductsForLocalFiltering


  return {
    product,
    loading,
    error,
    refetchProduct: fetchAllProductsForLocalFiltering, // Expose applyLocalFilters for manual refresh
  };
};

export default useSingleProduct;
