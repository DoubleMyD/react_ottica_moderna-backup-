import {
  ProductListContainer,
  ProductCard,
  ProductImagePlaceholder,
  ProductAction,
  ViewButton,
  ProductBrand,
  ProductPrice,
} from "./StyledElencoProdotti";

const ElencoProdotti = ({ products, filters }) => {
  // Filtra i prodotti in base ai criteri definiti in 'filters'
  const filteredProducts = products.filter((product) => {
    let matchesBrand = true;
    let matchesType = true;
    let matchesDisponibile = true;
    let matchesPrezzo = true;

    // Filtra per brand se ci sono brand selezionati
    if (filters.brands && filters.brands.length > 0) {
      matchesBrand = filters.brands.includes(product.brand);
    }

    // Filtra per tipologia se ci sono tipologie selezionate
    if (filters.tipologie && filters.tipologie.length > 0) {
      matchesType = filters.tipologie.includes(product.type);
    }

    // Filtra per disponibilità se il filtro è attivo
    if (filters.soloDisponibili) {
      matchesDisponibile = product.disponibile;
    }

    // Filtra per prezzo massimo se è stato inserito un valore
    if (filters.prezzoMassimo && filters.prezzoMassimo !== "") {
      matchesPrezzo = product.price <= parseFloat(filters.prezzoMassimo);
    }

    // Restituisce true solo se il prodotto corrisponde a tutti i filtri applicati
    return matchesBrand && matchesType && matchesDisponibile && matchesPrezzo;
  });

  return (
    <ProductListContainer>
      {filteredProducts.map((product) => (
        <ProductCard key={product.id}>
          <ProductBrand>{product.brand}</ProductBrand>
          <ProductPrice>€{product.price.toFixed(2)}</ProductPrice>
          <ProductImagePlaceholder>immagine</ProductImagePlaceholder>
          <ProductAction>
            <ViewButton
              onClick={() => console.log(`View product ${product.id}`)}
            >
              Vedi
            </ViewButton>
          </ProductAction>
        </ProductCard>
      ))}
    </ProductListContainer>
  );
};

export default ElencoProdotti;
