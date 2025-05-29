// src/components/PurchaseHistorySection/PurchaseHistorySection.jsx
import React from "react";
import PurchaseItem from "./PurchaseItem"; // Import the single item component
import { dummyPurchases } from "../../data/test/dummyPurchase"; // Import dummy data
import {
  HistoryContainer,
  HistorySectionTitle,
  PurchaseList,
} from "./StyledClientPurchaseHistory"; // Import section styles

const PurchaseHistorySection = () => {
  return (
    <HistoryContainer>
      <HistorySectionTitle>Storico Acquisti</HistorySectionTitle>
      {dummyPurchases.length > 0 ? (
        <PurchaseList>
          {dummyPurchases.map((purchase) => (
            <PurchaseItem key={purchase.id} purchase={purchase} />
          ))}
        </PurchaseList>
      ) : (
        <p>Non hai ancora effettuato nessun acquisto.</p>
      )}
    </HistoryContainer>
  );
};

export default PurchaseHistorySection;
