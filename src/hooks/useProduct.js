// src/hooks/useProduct.js
import { useState, useEffect, useCallback, useRef } from "react";
import { STRAPI_BASE_API_URL } from "../data/api";
import { buildQueryStringV5 } from "../utils/buildQueryString";

const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);

  // States for unique filter options. These will now be calculated ONCE from the full dataset.
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);

  // useRef to store the full, unfiltered, and formatted list of products fetched once.
  const allProductsDataRef = useRef([]);

  // State to track if the initial, comprehensive data fetch is complete
  const [initialDataFetched, setInitialDataFetched] = useState(false);

  // --- Effect 1: Initial fetch of ALL product data (runs only once on component mount) ---
  useEffect(() => {
    const fetchAllProductsForLocalFiltering = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = {
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
          ],
          pagination: { pageSize: 100000 },
        };
        const queryString = buildQueryStringV5(queryParams);

        console.log(
          `[useProducts] Fetching ALL products for local filtering (once): ${STRAPI_BASE_API_URL}/prodottos?${queryString}`
        );

        const response = await fetch(
          `${STRAPI_BASE_API_URL}/prodottos?${queryString}`
        );

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(
            errorBody.error?.message ||
              `Failed to fetch all products: ${response.statusText}`
          );
        }

        const data = await response.json();

        const formattedAllProducts = Array.isArray(data.data)
          ? data.data.map((item) => ({
              id: item.id,
              ...item,
              immagine:
                item?.immagine && item.immagine.url ? item.immagine : null,
            }))
          : [];

        allProductsDataRef.current = formattedAllProducts;

        // --- NEW LOCATION: Calculate ALL unique filter options from the full dataset here ---
        const allBrandsFromData = new Set();
        const allTypesFromData = new Set();

        allProductsDataRef.current.forEach((productItem) => {
          if (productItem.brand) allBrandsFromData.add(productItem.brand);
          if (productItem.tipologia)
            allTypesFromData.add(productItem.tipologia);
        });

        setAvailableBrands(Array.from(allBrandsFromData).sort());
        setAvailableTypes(Array.from(allTypesFromData).sort());
        // --- END NEW LOCATION ---

        setInitialDataFetched(true);
        console.log(
          `[useProducts] All products fetched and stored in ref. Total: ${allProductsDataRef.current.length} items.`
        );
      } catch (err) {
        console.error(
          "[useProducts] Error fetching all products for local filtering:",
          err
        );
        setError(`Errore nel caricamento dei dati iniziali: ${err.message}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProductsForLocalFiltering();
  }, []); // Empty dependency array: runs only once

  // --- Function 2: Apply local filters, sort, and paginate (runs on filter changes or initial data ready) ---
  const applyLocalFilters = useCallback(() => {
    if (!initialDataFetched) {
      console.log(
        "[useProducts - applyLocalFilters] Skipping: Initial data not yet fetched."
      );
      return;
    }
    if (error) {
      console.log(
        "[useProducts - applyLocalFilters] Skipping: Initial data fetch had an error."
      );
      return;
    }

    console.log(
      "[useProducts] Applying local filters. Current filters:",
      filters
    );

    let currentFilteredProducts = [...allProductsDataRef.current]; // Start with a copy of the full dataset

    // 1. Apply Filters based on the `filters` prop
    if (filters.brands && filters.brands.length > 0) {
      currentFilteredProducts = currentFilteredProducts.filter((p) =>
        filters.brands.includes(p.brand)
      );
    }
    if (filters.tipologie && filters.tipologie.length > 0) {
      // Using 'tipologies' from filter object as per your fix
      currentFilteredProducts = currentFilteredProducts.filter(
        (p) => filters.tipologie.includes(p.tipologia) // Corrected 'tipologia' field name in product data
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

    // --- REMOVED from here: Dynamic Calculation of Filter Options ---
    // This logic is now in the initial fetch useEffect.

    // 3. Client-side Pagination
    const pageSize = 25;
    const currentPage = 1;
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

    console.log(
      `[useProducts] Local filtering applied. Displaying ${paginatedProducts.length} of ${totalItems} total products.`
    );
  }, [filters, initialDataFetched, error]);

  // --- Effect 3: Trigger local filtering whenever the `applyLocalFilters` callback changes ---
  useEffect(() => {
    applyLocalFilters();
  }, [applyLocalFilters]);

  return {
    products,
    loading,
    error,
    meta,
    availableBrands, // These now always show all options from the full dataset
    availableTypes, // These now always show all options from the full dataset
    refetchProducts: applyLocalFilters,
  };
};

export default useProducts;
