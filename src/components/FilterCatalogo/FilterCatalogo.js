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
} from "../FilterCatalogo/StyledFilterCatalogo"; 
import Expander from "../Expander/Expander";
import { useState } from "react";

const CatalogoFilter = ({
  onFilterChange,
  availableBrands,
  availableTypes,
}) => {
  const [prezzoMassimo, setPrezzoMassimo] = useState("");
  const [soloDisponibili, setSoloDisponibili] = useState(false);
  const [tipologieSelezionate, setTipologieSelezionate] = useState([]);
  const [brandsSelezionati, setBrandsSelezionati] = useState([]);

  const handleInputChange = (name, value) => {
    if (name === "prezzo") {
      setPrezzoMassimo(value);
    } else if (name === "disponibile") {
      setSoloDisponibili(value);
    }
  };

  const handleCheckboxChange = (name, value) => {
    if (name === "tipologie") {
      setTipologieSelezionate((prev) =>
        prev.includes(value)
          ? prev.filter((t) => t !== value)
          : [...prev, value]
      );
    } else if (name === "brands") {
      setBrandsSelezionati((prev) =>
        prev.includes(value)
          ? prev.filter((b) => b !== value)
          : [...prev, value]
      );
    }
  };

  const handleOptionButtonClick = (name, value) => {
    if (name === "tipologie") {
      setTipologieSelezionate((prev) =>
        prev.includes(value)    //check if already selected
          ? prev.filter((t) => t !== value) //if already present, remove it
          : [...prev, value] //if not present, add it (spread operator)
      );
    } else if (name === "brands") {
      setBrandsSelezionati((prev) =>
        prev.includes(value)
          ? prev.filter((b) => b !== value)
          : [...prev, value]
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
          onChange={(e) => handleInputChange(e.target.name, e.target.value)}
          placeholder="Inserisci il prezzo massimo"
        />
      </FilterGroup>

      <FilterGroup>
        <FilterCheckboxLabel>
          <input
            type="checkbox"
            name="disponibile"
            checked={soloDisponibili}
            onChange={(e) => handleInputChange(e.target.name, e.target.checked)}
          />
          Mostra solo i prodotti disponibili
        </FilterCheckboxLabel>
      </FilterGroup>

      <Expander label="Tipologie Prodotto">
        <FilterGroup>
          {/*<FilterLabel>Tipologia Prodotto:</FilterLabel>*/}
          <FilterOptionsContainer className="horizontal">
            {availableTypes &&
              availableTypes.map((type) => (
                <FilterOptionButton
                  key={type}
                  className={
                    tipologieSelezionate.includes(type) ? "active" : ""
                  }
                  onClick={() => handleOptionButtonClick("tipologie", type)}
                >
                  {type}
                </FilterOptionButton>
              ))}
          </FilterOptionsContainer>
        </FilterGroup>
      </Expander>

      <Expander label="Brand">
      <FilterGroup>
        {/*<FilterLabel>Brand:</FilterLabel>*/}
        <FilterOptionsContainer>
          {availableBrands &&
            availableBrands.map((brand) => (
              <FilterCheckboxLabel key={brand}>
                <input
                  type="checkbox"
                  name="brands"
                  value={brand}
                  checked={brandsSelezionati.includes(brand)}
                  onChange={(e) =>
                    handleCheckboxChange(e.target.name, e.target.value)
                  }
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
    </FilterCatalogoContainer>
  );
};

export default CatalogoFilter;
