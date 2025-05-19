import ElencoProdotti from "../components/ElencoProdotti";
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

  const dummyProducts = [
    {
      id: 1,
      brand: "Ray-Ban",
      type: "Occhiali da Sole",
      price: 150,
      disponibile: true,
    },
    {
      id: 2,
      brand: "Gucci",
      type: "Occhiali da Vista",
      price: 250,
      disponibile: true,
    },
    {
      id: 3,
      brand: "Prada",
      type: "Occhiali da Sole",
      price: 200,
      disponibile: false,
    },
    {
      id: 4,
      brand: "Oakley",
      type: "Occhiali da Sole",
      price: 120,
      disponibile: true,
    },
    {
      id: 5,
      brand: "Versace",
      type: "Occhiali da Vista",
      price: 300,
      disponibile: true,
    },
    {
      id: 6,
      brand: "Ray-Ban",
      type: "Occhiali da Vista",
      price: 180,
      disponibile: false,
    },
    { id: 7, brand: "Gucci", type: "Accessori", price: 50, disponibile: true },
    {
      id: 8,
      brand: "Prada",
      type: "Lenti a Contatto",
      price: 75,
      disponibile: true,
    },
  ];
  
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
        <ElencoProdotti products={dummyProducts} filters={filters} />

      </div>
    </div>
  );
};

export default CatalogoPage;
