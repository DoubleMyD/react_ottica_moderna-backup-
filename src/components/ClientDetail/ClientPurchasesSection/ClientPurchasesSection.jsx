// src/components/ClientDetail/ClientPurchasesSection.jsx
import React from "react";
import usePurchaseHistory from "../../../hooks/usePurchaseHistory";
import {
  SectionCard,
  SectionTitle,
  SectionContent,
  MostPurchasedProductBlock,
  PlaceholderText,
} from "./StyledClientPurchasesSection"; // <--- Make sure this path is correct based on where you put the style file
import { formatCurrency, formatItalianDate } from "../../../utils/formatters";
import PurchaseHistorySection from "../../ClientPurchase/PurchaseHistorySection";
import { STRAPI_BASE_URL } from "../../../data/api";
import { Pages } from "../../../data/constants";
import { useNavigate } from "react-router-dom";
// import { Colors } from "../../../styles/colors"; // No direct import needed here if only used in styled components

const ClientPurchasesSection = ({ clientId }) => {
  const { purchases, loading, error, mostPurchasedProduct, totalProductSpent } =
    usePurchaseHistory(clientId);
  const navigate = useNavigate();

  const handleProductClick = (productDocumentId, event) => {
    event.stopPropagation(); // Prevent row expansion if applicable
    navigate(`${Pages.CATALOG}/${productDocumentId}`); // Adjust this path as per your routing
  };

  if (loading) {
    return (
      <SectionCard>
        <SectionTitle>Storico Acquisti</SectionTitle>
        <PlaceholderText>Caricamento storico acquisti...</PlaceholderText>
      </SectionCard>
    );
  }

  if (error) {
    return (
      <SectionCard>
        <SectionTitle>Storico Acquisti</SectionTitle>
        <PlaceholderText style={{ color: "red" }}>
          Errore: {error}
        </PlaceholderText>
      </SectionCard>
    );
  }

  return (
    <SectionCard>
      {/* <SectionTitle>Storico Acquisti</SectionTitle> */}
      {mostPurchasedProduct && (
        <MostPurchasedProductBlock
          onClick={(e) =>
            handleProductClick(mostPurchasedProduct.documentId, e)
          }
        >
          <h3>
            Prodotto Più Acquistato:{" "}
            <span>{mostPurchasedProduct.nome || "N.D."}</span>
          </h3>
          <p>
            Spesa Totale per Prodotto:{" "}
            <span>{formatCurrency(totalProductSpent)}</span>
          </p>
          {mostPurchasedProduct.immagine && (
            <img
              src={`${STRAPI_BASE_URL}${mostPurchasedProduct.immagine.url}`}
              alt={mostPurchasedProduct.nome}
            />
          )}
        </MostPurchasedProductBlock>
      )}

      <SectionContent>
        <PurchaseHistorySection clientId={clientId} />
      </SectionContent>
      {/* This renders the actual list of purchases. Its styling is defined within PurchaseHistorySection. */}
      
    </SectionCard>
  );
};

export default ClientPurchasesSection;
