import React, { useState, useEffect } from "react";
import ElencoProdotti from "../components/ElencoProdotti/ElencoProdotti";
import CatalogoFilter from "../components/FilterCatalogo/FilterCatalogo";
import useProducts from "../hooks/useProducts"; // Assuming this is the hook with the JSON.stringify fix

const CatalogoPage = ({
  isAdminView = false, // Default to false for the general catalog
  onEditProduct, // Will likely be undefined or a no-op for the public catalog
  onDeleteProduct: onDeleteProductSuccess, // Will likely be undefined or a no-op for the public catalog
}) => {
  const [filters, setFilters] = useState({
    prezzoMassimo: "",
    soloDisponibili: false,
    tipologie: [],
    brands: [],
  });

  // The useProducts hook now uses JSON.stringify(filters) in its dependencies,
  // so it will only re-run when the content of 'filters' changes.
  const { products, loading, error, availableBrands, availableTypes } =
    useProducts(filters);

  const handleFilterChange = (newFilters) => {
    // Deep compare arrays and objects to prevent unnecessary state updates
    const filtersChanged =
      filters.prezzoMassimo !== newFilters.prezzoMassimo ||
      filters.soloDisponibili !== newFilters.soloDisponibili ||
      // Compare arrays by their stringified versions for deep equality
      JSON.stringify(filters.tipologie) !==
        JSON.stringify(newFilters.tipologie) ||
      JSON.stringify(filters.brands) !== JSON.stringify(newFilters.brands);

    if (filtersChanged) {
      setFilters(newFilters);
    }
    // Removed the empty else block. No action needed if filters haven't changed.
  };

  return (
    <div>
      {!isAdminView && <h1>Catalogo Prodotti</h1>}
      <div
        style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start" }}
      >
        {" "}
        {/* Added flexWrap */}
        {loading && (
          <p style={{ padding: "20px", textAlign: "center", flexGrow: 1 }}>
            Caricamento filtri e prodotti...
          </p>
        )}
        {error && (
          <p
            style={{
              padding: "20px",
              textAlign: "center",
              color: "red",
              flexGrow: 1,
            }}
          >
            Errore nel caricamento: {error}
          </p>
        )}
        {/* Render CatalogoFilter only if not loading, no error, and there are filter options */}
        {!loading &&
        !error &&
        (availableBrands.length > 0 || availableTypes.length > 0) ? (
          <CatalogoFilter
            onFilterChange={handleFilterChange}
            availableBrands={availableBrands}
            availableTypes={availableTypes}
            currentFilters={filters} // Pass the filters state as currentFilters
          />
        ) : (
          // Display "Nessun filtro disponibile" only if no loading/error and no filter options
          !loading &&
          !error && (
            <div style={{ width: "250px", padding: "20px" }}>
              Nessun filtro disponibile.
            </div>
          )
        )}
        {/* Display messages based on products array */}
        {!loading && !error && products.length === 0 && (
          <p style={{ flexGrow: 1, textAlign: "center", padding: "20px" }}>
            Nessun prodotto trovato con i filtri selezionati.
          </p>
        )}
        {/* Render ElencoProdotti only if not loading, no error, and products are available */}
        {!loading && !error && products.length > 0 && (
          <ElencoProdotti
            products={products}
            isAdminView={isAdminView}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProductSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default CatalogoPage;
