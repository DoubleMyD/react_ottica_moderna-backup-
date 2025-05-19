import CatalogoFilter from "../components/FilterCatalogo";
import { useState } from "react";

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
        {/* Qui andrebbe la visualizzazione dei tuoi prodotti */}
        <div style={{ flexGrow: 1, padding: "20px" }}>
          {/* ... Elenco dei prodotti ... */}
        </div>
      </div>
    </div>
  );
};

export default CatalogoPage;
