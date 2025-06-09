// src/components/ElencoProdotti/ElencoProdotti.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ProductListContainer,
  ProductCard,
  ProductImage,
  ProductInfo,
  ProductName,
  ProductPrice,
  ProductBrand,
  ProductAction,
  ViewButton,
} from "./StyledElencoProdotti";
import { STRAPI_BASE_URL } from "../../data/api";
import { Pages } from "../../data/constants";

const ElencoProdotti = ({ products }) => {
  const navigate = useNavigate();

  const handleProductClick = (documentId) => {
    navigate(`${Pages.CATALOG}/${documentId}`);
  };

  return (
    <ProductListContainer>
      {products.map((product) => {
        const hasStrapiImage = product.immagine && product.immagine.url;
        const strapiImageUrl = hasStrapiImage
          ? `${STRAPI_BASE_URL}${product.immagine.url}`
          : null;
        
        const placeholderImageUrl = "/images/placeholder-product.png";
        return (
          <ProductCard key={product.id}>
            {product.brand && <ProductBrand>{product.brand}</ProductBrand>}

            {hasStrapiImage ? (
              <ProductImage
                src={strapiImageUrl}
                alt={product.immagine.alternativeText || product.nome}
              />
            ) : (
              <img
                src={placeholderImageUrl}
                alt="No available"
                style={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  backgroundColor: "#f0f0f0",
                }}
              />
            )}

            {product.prezzo_unitario !== undefined &&
              product.prezzo_unitario !== null && (
                <ProductPrice>${product.prezzo_unitario.toFixed(2)}</ProductPrice>
              )}

            <ProductInfo>
              <ProductName>{product.nome}</ProductName>
            </ProductInfo>

            <ProductAction>
              <ViewButton onClick={() => handleProductClick(product.documentId)}>
                View Details
              </ViewButton>
            </ProductAction>
          </ProductCard>
        );
      })}
    </ProductListContainer>
  );
};

export default ElencoProdotti;