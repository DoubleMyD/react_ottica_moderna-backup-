// src/hooks/useProduct.js
import { useState, useEffect, useCallback, useRef } from "react";
import { STRAPI_BASE_API_URL } from "../data/api";
import { buildQueryStringV5 } from "../utils/buildQueryString";
import { useAuth } from "./authContext";
import { Role } from "../data/constants";

const useProducts = (filters = {}) => {
  const { role, authToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);

  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);

  const allProductsDataRef = useRef([]);
  const [initialDataFetched, setInitialDataFetched] = useState(false);

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
        `${STRAPI_BASE_API_URL}/prodottos?${queryString}`,
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
      const formattedAllProducts = Array.isArray(data.data)
        ? data.data.map((item) => ({
            id: item.id,
            documentId: item.documentId, // Ensure documentId is mapped
            ...item,
            immagine:
              item?.immagine && item.immagine.url ? item.immagine : null,
          }))
        : [];

      allProductsDataRef.current = formattedAllProducts;

      const allBrandsFromData = new Set();
      const allTypesFromData = new Set();

      allProductsDataRef.current.forEach((productItem) => {
        if (productItem.brand) allBrandsFromData.add(productItem.brand);
        if (productItem.tipologia) allTypesFromData.add(productItem.tipologia);
      });

      setAvailableBrands(Array.from(allBrandsFromData).sort());
      setAvailableTypes(Array.from(allTypesFromData).sort());

      setInitialDataFetched(true);
    } catch (err) {
      console.error(
        "[useProducts] Error fetching all products for local filtering:",
        err
      );
      setError(`Errore nel caricamento dei dati iniziali: ${err.message}.`);
    } finally {
      setLoading(false);
    }
  }, [refreshTrigger]); // DEPENDENCY ADDED: refreshTrigger

  // --- Effect 1: Initial fetch of ALL product data (now depends on refreshTrigger) ---
  useEffect(() => {
    fetchAllProductsForLocalFiltering();
  }, [fetchAllProductsForLocalFiltering]); // DEPENDENCY ADDED: fetchAllProductsForLocalFiltering

  // --- Function to trigger a manual refetch ---
  const refetchProducts = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1); // Increment trigger to re-run fetch
  }, []);

  // --- Function 2: Apply local filters, sort, and paginate (runs on filter changes or initial data ready) ---
  const applyLocalFilters = useCallback(() => {
    if (!initialDataFetched) {
      
      return;
    }
    if (error) {
      
      return;
    }

    let currentFilteredProducts = [...allProductsDataRef.current];

    // 1. Apply Filters based on the `filters` prop
    if (filters.brands && filters.brands.length > 0) {
      currentFilteredProducts = currentFilteredProducts.filter((p) =>
        filters.brands.includes(p.brand)
      );
    }
    if (filters.tipologie && filters.tipologie.length > 0) {
      currentFilteredProducts = currentFilteredProducts.filter((p) =>
        filters.tipologie.includes(p.tipologia)
      );
    }
    if (filters.soloDisponibili) {
      currentFilteredProducts = currentFilteredProducts.filter(
        (p) => p.quantita_disponibili > 0
      );
    }
    if (
      filters.prezzoMassimo !== "" &&
      filters.prezzoMassimo !== null &&
      filters.prezzoMassimo !== undefined
    ) {
      const maxPrice = parseFloat(filters.prezzoMassimo);
      if (!isNaN(maxPrice)) {
        currentFilteredProducts = currentFilteredProducts.filter(
          (p) => p.prezzo_unitario <= maxPrice
        );
      }
    }

    // 2. Client-side Sorting
    currentFilteredProducts.sort((a, b) =>
      (a.nome || "").localeCompare(b.nome || "")
    );

    // 3. Client-side Pagination
    const pageSize = 25;
    const currentPage = 1; // Assuming always page 1 for now, or add as filter prop
    const totalItems = currentFilteredProducts.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProducts = currentFilteredProducts.slice(
      startIndex,
      startIndex + pageSize
    );

    setProducts(paginatedProducts);
    setMeta({
      pagination: {
        page: currentPage,
        pageSize: pageSize,
        pageCount: totalPages,
        total: totalItems,
      },
    });
  }, [
    // IMPORTANT: Ensure the 'filters' object passed to this hook is MEMOIZED
    // in the parent component using `useMemo`. Otherwise, this `useCallback`
    // will re-create `applyLocalFilters` on every parent re-render if the
    // filters object reference changes, leading to an infinite loop.
    JSON.stringify(filters), // Use JSON.stringify for deep comparison of filters object
    initialDataFetched,
    error,
  ]);

  // --- Effect 3: Trigger local filtering whenever the `applyLocalFilters` callback changes ---
  useEffect(() => {
    applyLocalFilters();
  }, [applyLocalFilters]);

  return {
    products,
    loading,
    error,
    meta,
    availableBrands,
    availableTypes,
    refetchProducts: fetchAllProductsForLocalFiltering, // Expose applyLocalFilters for manual refresh
  };
};

export default useProducts;
