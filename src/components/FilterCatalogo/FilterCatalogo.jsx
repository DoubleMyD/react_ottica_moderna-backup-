import React, { useState, useEffect } from "react";
import {
  FilterCatalogoContainer,
  FilterCatalogoTitle,
  FilterGroup,
  FilterLabel,
  FilterInput,
  FilterCheckboxLabel,
  FilterOptionsContainer,
  FilterOptionButton,
  FilterCatalogoButton,
} from "./StyledFilterCatalogo";
import Expander from "../Expander/Expander";

const CatalogoFilter = ({
  onFilterChange,
  availableBrands,
  availableTypes,
  currentFilters,
}) => {
  // Initialize local state from currentFilters prop
  const [prezzoMassimo, setPrezzoMassimo] = useState(
    currentFilters.prezzoMassimo || ""
  );
  const [soloDisponibili, setSoloDisponibili] = useState(
    currentFilters.soloDisponibili || false
  );
  const [tipologieSelezionate, setTipologieSelezionate] = useState(
    currentFilters.tipologie || []
  );
  const [brandsSelezionati, setBrandsSelezionati] = useState(
    currentFilters.brands || []
  );

  // Use useEffect to synchronize local state with prop changes
  // This is crucial: it ensures FilterCatalogo's local state reflects CatalogoPage's filters
  useEffect(() => {
    setPrezzoMassimo(currentFilters.prezzoMassimo || "");
    setSoloDisponibili(currentFilters.soloDisponibili || false);
    setTipologieSelezionate(currentFilters.tipologie || []);
    setBrandsSelezionati(currentFilters.brands || []);
  }, [currentFilters]); // Dependency: run only when 'currentFilters' object reference changes

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "prezzo") {
      setPrezzoMassimo(value);
    } else if (name === "disponibile") {
      setSoloDisponibili(checked); // Use 'checked' for checkbox input
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "brands") {
      setBrandsSelezionati((prev) =>
        checked ? [...prev, value] : prev.filter((b) => b !== value)
      );
    }
  };

  const handleOptionButtonClick = (name, value) => {
    if (name === "tipologies") {
      setTipologieSelezionate((prev) =>
        prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
      );
    }
  };

  const handleApplyFilters = () => {
    onFilterChange({
      prezzoMassimo,
      soloDisponibili,
      tipologie: tipologieSelezionate,
      brands: brandsSelezionati,
    });
  };

  const handleClearFilters = () => {
    // Reset local state to initial empty values
    setPrezzoMassimo("");
    setSoloDisponibili(false);
    setTipologieSelezionate([]);
    setBrandsSelezionati([]);
    // Call onFilterChange to update parent's state
    onFilterChange({
      prezzoMassimo: "",
      soloDisponibili: false,
      tipologie: [],
      brands: [],
    });
  };

  return (
    <FilterCatalogoContainer>
      <FilterCatalogoTitle>Filtri</FilterCatalogoTitle>

      <FilterGroup>
        <FilterLabel htmlFor="prezzo">Prezzo Massimo:</FilterLabel>
        <FilterInput
          type="number"
          id="prezzo"
          name="prezzo"
          value={prezzoMassimo}
          onChange={handleInputChange} // Pass event directly
          placeholder="Inserisci il prezzo massimo"
        />
      </FilterGroup>

      <FilterGroup>
        <FilterCheckboxLabel>
          <input
            type="checkbox"
            name="disponibile"
            checked={soloDisponibili}
            onChange={handleInputChange} // Pass event directly
          />
          Mostra solo i prodotti disponibili
        </FilterCheckboxLabel>
      </FilterGroup>

      <Expander label="Tipologie Prodotto">
        <FilterGroup>
          <FilterOptionsContainer className="horizontal">
            {availableTypes &&
              availableTypes.map((type) => (
                <FilterOptionButton
                  key={type}
                  className={
                    tipologieSelezionate.includes(type) ? "active" : ""
                  }
                  onClick={() => handleOptionButtonClick("tipologies", type)}
                >
                  {type}
                </FilterOptionButton>
              ))}
          </FilterOptionsContainer>
        </FilterGroup>
      </Expander>

      <Expander label="Brand">
        <FilterGroup>
          <FilterOptionsContainer>
            {availableBrands &&
              availableBrands.map((brand) => (
                <FilterCheckboxLabel key={brand}>
                  <input
                    type="checkbox"
                    name="brands"
                    value={brand}
                    checked={brandsSelezionati.includes(brand)}
                    onChange={handleCheckboxChange} // Pass event directly
                  />
                  {brand}
                </FilterCheckboxLabel>
              ))}
          </FilterOptionsContainer>
        </FilterGroup>
      </Expander>

      <FilterCatalogoButton onClick={handleApplyFilters}>
        Applica Filtri
      </FilterCatalogoButton>
      <FilterCatalogoButton onClick={handleClearFilters}>
        Reset Filtri
      </FilterCatalogoButton>
    </FilterCatalogoContainer>
  );
};

export default CatalogoFilter;