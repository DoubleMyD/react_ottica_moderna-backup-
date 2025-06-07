// src/components/PurchaseHistorySection/PurchaseItem.jsx
import React from "react";
import { Pages } from "../../data/constants"; // For linking to product pages
import { dummyProducts } from "../../data/test/dummyProducts"; // Import dummy product data

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
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <PurchaseItemContainer>
      <PurchaseHeader>
        <HeaderDetail>
          Data: <span>{purchase.date}</span>
        </HeaderDetail>
        <HeaderDetail>
          Quantità Totale: <span>{purchase.totalQuantity}</span>
        </HeaderDetail>
        <HeaderDetail>
          Totale Pagato: <span>{formatCurrency(purchase.totalPayment)}</span>
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
            {purchase.products.map((item) => {
              // Renamed 'product' to 'item' to avoid confusion with lookup
              const productDetail = dummyProducts.find(
                (p) => p.id === item.productId
              ); // <--- Lookup product details

              // Handle case where product might not be found (e.g., deleted product, dummy data inconsistency)
              if (!productDetail) {
                return (
                  <tr key={item.productId}>
                    <td>Prodotto Sconosciuto (ID: {item.productId})</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unitPriceAtPurchase)}</td>
                    <td>{formatCurrency(item.actualPrice)}</td>
                  </tr>
                );
              }

              return (
                <tr key={item.productId}>
                  <td>
                    <ProductNameLink
                      to={`${Pages.CATALOG}/${productDetail.id}`}
                    >
                      <ProductImage
                        src={productDetail.imageUrl}
                        alt={productDetail.name}
                      />
                      {productDetail.name}
                    </ProductNameLink>
                  </td>
                  <td>{item.quantity}</td>
                  <td>
                    <PriceInfo>
                      <span className="original-price">
                        {formatCurrency(item.unitPriceAtPurchase)}
                      </span>
                    </PriceInfo>
                  </td>
                  <td>
                    <PriceInfo>
                      {item.actualPrice < item.unitPriceAtPurchase ? (
                        <span className="discounted-price">
                          {formatCurrency(item.actualPrice)}
                        </span>
                      ) : (
                        <span className="current-price">
                          {formatCurrency(item.actualPrice)}
                        </span>
                      )}
                    </PriceInfo>
                  </td>
                  <td>
                    {item.actualPrice < item.unitPriceAtPurchase ? (
                      <span className="discount-info">
                        {(
                          ((item.unitPriceAtPurchase - item.actualPrice) /
                            item.unitPriceAtPurchase) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    ) : (
                      <span>Nessuno</span>
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
