import React, { useState, useEffect } from "react";
import ElencoProdotti from "../components/ElencoProdotti/ElencoProdotti";
import CatalogoFilter from "../components/FilterCatalogo/FilterCatalogo";
import useProducts from "../hooks/useProduct";

const CatalogoPage = () => {

  const [filters, setFilters] = useState({
    prezzoMassimo: "",
    soloDisponibili: false,
    tipologie: [],
    brands: [],
  });

  // Log filters state whenever it changes
  useEffect(() => {
    console.log(`[CatalogoPage] Filters state updated:`, filters);
  }, [filters]); // Dependency array: run when 'filters' object reference changes

  const {
    products,
    loading,
    error,
    availableBrands,
    availableTypes,
  } = useProducts(filters);

  const handleFilterChange = (newFilters) => {

    // Deep compare arrays and objects to prevent unnecessary state updates
    const filtersChanged = (
      filters.prezzoMassimo !== newFilters.prezzoMassimo ||
      filters.soloDisponibili !== newFilters.soloDisponibili ||
      JSON.stringify(filters.tipologie) !== JSON.stringify(newFilters.tipologie) ||
      JSON.stringify(filters.brands) !== JSON.stringify(newFilters.brands)
    );

    if (filtersChanged) {
      setFilters(newFilters);
    } else {
    }
  };

  return (
    <div>
      <h1>Catalogo Prodotti</h1>
      <div style={{ display: "flex" }}>
        {loading && (
          <p style={{ padding: '20px', textAlign: 'center' }}>Caricamento filtri e prodotti...</p>
        )}
        {error && (
          <p style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Errore nel caricamento: {error}</p>
        )}

        {/* Ensure availableBrands and availableTypes are treated correctly here */}
        {!loading && !error && (availableBrands.length > 0 || availableTypes.length > 0) ? (
          <CatalogoFilter
            onFilterChange={handleFilterChange}
            availableBrands={availableBrands}
            availableTypes={availableTypes}
            currentFilters={filters} // Pass the filters state as currentFilters
          />
        ) : (
          !loading && !error && (
            <div style={{ width: '250px', padding: '20px' }}>Nessun filtro disponibile.</div>
          )
        )}

        {!loading && !error && products.length === 0 && (
          <p style={{ flexGrow: 1, textAlign: 'center' }}>Nessun prodotto trovato con i filtri selezionati.</p>
        )}
        {!loading && !error && products.length > 0 && (
          <ElencoProdotti products={products} />
        )}
      </div>
    </div>
  );
};

export default CatalogoPage;