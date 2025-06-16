// src/components/PurchaseHistorySection/PurchaseItem.jsx
import React from "react";
import { Pages } from "../../data/constants"; // For linking to product pages
import { STRAPI_BASE_URL } from "../../data/api"; // Base URL for Strapi images

import {
  PurchaseItemContainer,
  PurchaseHeader,
  HeaderDetail,
  ProductTableWrapper,
  ProductTable,
  ProductImage,
  ProductNameLink,
  PriceInfo,
} from "./StyledClientPurchaseHistory"; // Import styles from common file

const PurchaseItem = ({ purchase }) => {
  const purchaseAttrs = purchase;

  const formatCurrency = (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) {
      return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(0);
    }
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formattedDate = purchaseAttrs.data_acquisto
    ? new Date(purchaseAttrs.data_acquisto).toLocaleDateString("it-IT", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "N.D.";

  const dettaglioAcquistos = purchaseAttrs.dettaglio_acquistos || [];

  return (
    <PurchaseItemContainer>
      <PurchaseHeader>
        <HeaderDetail>
          Data: <span>{formattedDate}</span>
        </HeaderDetail>
        <HeaderDetail>
          Quantità Totale: <span>{purchaseAttrs.quantita_totale || 0}</span>
        </HeaderDetail>
        <HeaderDetail>
          Totale Pagato:{" "}
          <span>{formatCurrency(purchaseAttrs.importo_totale)}</span>
        </HeaderDetail>
      </PurchaseHeader>
      <ProductTableWrapper>
        <ProductTable>
          <thead>
            <tr>
              <th>Prodotto</th>
              <th>Quantità</th>
              <th>Prezzo Unitario Catalogo</th>
              <th>Prezzo Unitario Vendita</th>
              <th>Sconto Applicato</th>
            </tr>
          </thead>
          <tbody>
            {dettaglioAcquistos.map((detailItem) => {
              const product = detailItem.prodotto;
              const productImage = product?.immagine?.url
                ? `${STRAPI_BASE_URL}${product.immagine.url}`
                : "/path/to/default-image.png";

              // !! IMPORTANT CHANGE HERE !!
              // Access 'dettaglio_promozioni' instead of 'promozione'
              const promotion = detailItem.dettaglio_promozioni; 

              const originalPrice = detailItem.prezzo_unitario_originale;
              const discountedPrice = detailItem.prezzo_unitario_scontato;
              const quantity = detailItem.quantita;

              const discountPercentage =
                originalPrice > discountedPrice
                  ? (
                      ((originalPrice - discountedPrice) / originalPrice) *
                      100
                    ).toFixed(2)
                  : null;

              return (
                <tr key={detailItem.id}>
                  <td>
                    {product ? (
                      <ProductNameLink
                        to={`${Pages.CATALOG}/${
                          product.documentId //|| product.id
                        }`}
                      >
                        <ProductImage
                          src={productImage}
                          alt={product.nome || "Prodotto"}
                        />
                        {product.nome}
                      </ProductNameLink>
                    ) : (
                      <span>Prodotto Sconosciuto</span>
                    )}
                  </td>
                  <td>{quantity}</td>
                  <td>
                    <PriceInfo>
                      <span className="original-price">
                        {formatCurrency(originalPrice)}
                      </span>
                    </PriceInfo>
                  </td>
                  <td>
                    <PriceInfo>
                      {discountedPrice < originalPrice ? (
                        <span className="discounted-price">
                          {formatCurrency(discountedPrice)}
                        </span>
                      ) : (
                        <span className="current-price">
                          {formatCurrency(discountedPrice)}
                        </span>
                      )}
                    </PriceInfo>
                  </td>
                  <td>
                    {discountPercentage ? (
                      <span className="discount-info">
                        {discountPercentage}%
                      </span>
                    ) : (
                      <span>Nessuno</span>
                    )}
                    {/* !! IMPORTANT CHANGE HERE !! */}
                    {/* Display tipo_applicazione and valore instead of titolo */}
                    {promotion && (
                      <div>
                        <small>
                          ({promotion.tipo_applicazione}: {promotion.valore}%)
                        </small>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </ProductTable>
      </ProductTableWrapper>
    </PurchaseItemContainer>
  );
};

export default PurchaseItem;