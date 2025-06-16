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
  ProductPromoDetails, // NEW: Import the new styled component
  PromoDetailItem, // NEW: Import the nested styled component
  AdminActionsContainer, // NEW: Import AdminActionsContainer
  AdminActionButton, // NEW: Import AdminActionButton
} from "./StyledElencoProdotti";
import { STRAPI_BASE_URL } from "../../data/api";
import { Pages } from "../../data/constants";
import DeleteProductButton from "../Admin/Product/AdminProducts/DeleteProductButton";

// Updated props: onEditProduct and onDeleteProduct now expect to receive the full product object
const ElencoProdotti = ({
  products,
  isInPromotionContext = false,
  isAdminView = false,
  showProductDetailLink = true,
  columnWidth = "250px",
  isTagMode = false,
  onRemove,
  onEditProduct,
  onDeleteProduct: onDeleteProductSuccess,
}) => {
  const navigate = useNavigate();

  const handleProductClick = (documentId) => {
    navigate(`${Pages.CATALOG}/${documentId}`);
  };

  const handleEditClick = (product, e) => {
    // Now receives full product object
    e.stopPropagation();
    if (onEditProduct) {
      onEditProduct(product); // Pass the entire product object
    }
  };

  const handleDeleteClick = (documentId, e) => {
    e.stopPropagation();
    if (onDeleteProductSuccess) {
      onDeleteProductSuccess(documentId);
    }
  };

  return (
    <ProductListContainer $columnWidth="250px">
      {products.map((product) => {
        const hasStrapiImage = product.immagine && product.immagine.url;
        const strapiImageUrl = hasStrapiImage
          ? `${STRAPI_BASE_URL}${product.immagine.url}`
          : null;

        const placeholderImageUrl = "/images/placeholder-product.png";

        return (
          <ProductCard key={product.id}>
            {isTagMode && (
              <AdminActionButton
                onClick={(e) => onRemove(product.documentId, e)}
                title="Rimuovi Prodotto"
              >
                ❌
              </AdminActionButton>
            )}

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
                <ProductPrice>
                  ${product.prezzo_unitario.toFixed(2)}
                </ProductPrice>
              )}

            <ProductInfo>
              <ProductName>{product.nome}</ProductName>
            </ProductInfo>

            {/* NEW: Display promotion-specific details if in promotion context */}
            {isInPromotionContext &&
              (product.tipo_applicazione_promozione ||
                product.valore_promozione !== undefined) && (
                <ProductPromoDetails>
                  {product.tipo_applicazione_promozione && (
                    <PromoDetailItem>
                      <span>Tipo applicazione:</span>
                      <strong>{product.tipo_applicazione_promozione}</strong>
                    </PromoDetailItem>
                  )}
                  {product.valore_promozione !== undefined &&
                    product.valore_promozione !== null && (
                      <PromoDetailItem>
                        <span>Valore:</span>
                        <strong>{product.valore_promozione}</strong>
                      </PromoDetailItem>
                    )}
                </ProductPromoDetails>
              )}

            <ProductAction>
              {showProductDetailLink && (
                <ViewButton
                  onClick={() => handleProductClick(product.documentId)}
                >
                  View Details
                </ViewButton>
              )}
              {isAdminView && (
                <>
                  <AdminActionButton
                    onClick={(e) => handleEditClick(product, e)}
                    title="Modifica Prodotto"
                  >
                    {" "}
                    {/* Pass full product */}
                    ✏️
                  </AdminActionButton>
                  <DeleteProductButton
                    onDeleteSuccess={onDeleteProductSuccess}
                    product={product}
                  ></DeleteProductButton>
                  
                </>
              )}
              {}
            </ProductAction>
          </ProductCard>
        );
      })}
    </ProductListContainer>
  );
};

export default ElencoProdotti;
