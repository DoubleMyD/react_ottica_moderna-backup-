import ElencoProdotti from "../components/ElencoProdotti/ElencoProdotti";
import CatalogoFilter from "../components/FilterCatalogo/FilterCatalogo";
import { useState } from "react";
import TopBar from "../components/TopBar/TopBar";

import { dummyProducts } from "../data/test/dummyProducts"; // Import dummy products data

const CatalogoPage = () => {

  const [filters, setFilters] = useState({});
  const availableBrands = ["Ray-Ban", "Gucci", "Prada", "Oakley", "Versace"];
  const availableTypes = [
    "Occhiali da Sole",
    "Occhiali da Vista",
    "Lenti a Contatto",
    "Accessori",
  ];

  const handleFilterChange = (newFilters) => {
    console.log("Nuovi filtri:", newFilters);
    setFilters(newFilters);
    // Qui potresti chiamare la tua funzione per filtrare i prodotti
  };

  
  
  return (
    <div>
      <h1>Catalogo Prodotti</h1>
      <div style={{ display: "flex" }}>
        <CatalogoFilter
          onFilterChange={handleFilterChange}
          availableBrands={availableBrands}
          availableTypes={availableTypes}
        />
        <ElencoProdotti products={dummyProducts} filters={filters} />

      </div>
    </div>
  );
};

export default CatalogoPage;
