// src/components/PurchaseHistorySection/PurchaseHistorySection.jsx
import React from "react";
import styled from "styled-components";
import { Colors } from "../../styles/colors"; // Correct path to your Colors

const HistoryContainer = styled.div`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  color: ${Colors.darkText};

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const HistoryTitle = styled.h2`
  font-size: 2rem;
  color: ${Colors.darkSectionTitle};
  margin-bottom: 20px;
`;

const HistoryDescription = styled.p`
  font-size: 1.1rem;
  color: ${Colors.mediumGray};
  line-height: 1.6;
`;

const PurchaseHistorySection = () => {
  // In a real app, you would fetch and display the user's purchase history here.
  // This is just a placeholder.
  return (
    <HistoryContainer>
      <HistoryTitle>Storico Acquisti</HistoryTitle>
      <HistoryDescription>
        Qui potrai visualizzare tutti i tuoi acquisti precedenti.
        <br />
        (Dettagli degli ordini e prodotti acquistati verranno mostrati qui.)
      </HistoryDescription>
      {/* Example of dummy purchase data structure (you'd map over this) */}
      {/*
      <ul>
        <li>Ordine #12345 - 2024-01-10 - Totale: €150.00</li>
        <li>Ordine #12346 - 2024-03-22 - Totale: €75.50</li>
      </ul>
      */}
    </HistoryContainer>
  );
};

export default PurchaseHistorySection;
