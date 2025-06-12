// src/pages/PromotionDetailPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import usePromotionDetail from "../../hooks/usePromotionDetails"; // The new hook

import {
  PromotionDetailContainer,
  BackArrowButton,
  PromotionHeaderGrid,
  PromotionMainInfo,
  InfoBlock,
  PromotionMetaInfo,
  PromotionDates,
  ClientTypesInvolvedBlock,
  ClientTypeTagList,
  ClientTypeTag,
  ProductsSection,
  ProductListContainer,
  AddProductButton,
  PlaceholderText,
} from "./StyledAdminPromotionDetailPage"; // Your new styled components
import { formatItalianDate } from "../../utils/formatters"; // Re-use formatter
import ElencoProdotti from "../ElencoProdotti/ElencoProdotti";
import { AdminSection, Pages } from "../../data/constants";
import usePromotionUsageStats from "../../hooks/usePromotionUsageStats";

const AdminPromotionDetailPage = () => {
  const { documentId: promotionDocumentId } = useParams(); // Get promotion DocumentId from URL
  const navigate = useNavigate();

  const { promotion, involvedProducts, loading, error } =
    usePromotionDetail(promotionDocumentId);
  const {
    sentCount,
    usedCount,
    loading: usageStatsLoading,
    error: usageStatsError,
  } = usePromotionUsageStats(promotion?.id); // Pass promotion.id only when available

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAddProduct = () => {
    alert("Funzione 'Aggiungi Prodotto' non implementata!");
    // Example: navigate('/admin/products/add-to-promotion', { state: { promotionId: promotion?.id } });
  };

  // New handler for clicking on an associated client type
  const handleAssociatedTypeClick = (typeId, event) => {
    event.stopPropagation(); // Prevent row expansion if applicable
    // Navigate to the TipologieCliente section with the specific typeId
    navigate(
      `${Pages.ADMIN}?section=${AdminSection.Profilazione_TipologieCliente}&typeId=${typeId}`
    );
  };

  if (loading) {
    return (
      <PromotionDetailContainer>
        <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>
        <PlaceholderText>Caricamento dettagli promozione...</PlaceholderText>
      </PromotionDetailContainer>
    );
  }

  if (error) {
    return (
      <PromotionDetailContainer>
        <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>
        <PlaceholderText style={{ color: "red" }}>
          Errore: {error}
        </PlaceholderText>
      </PromotionDetailContainer>
    );
  }

  if (!promotion) {
    return (
      <PromotionDetailContainer>
        <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>
        <PlaceholderText>Promozione non trovata.</PlaceholderText>
      </PromotionDetailContainer>
    );
  }

  // Destructure promotion attributes
  const {
    titolo,
    descrizione,
    data_inizio,
    data_fine,
    codice,
    numero_utilizzi,
    tipologia_clientes, // Populated client types
  } = promotion; // Data is directly available from the hook, no .attributes

  // Map client types for rendering tags
  const involvedClientTypes =
    tipologia_clientes?.map((type) => ({
      id: type.id,
      documentId: type.documentId,
      nome: type.nome,
    })) || [];

  return (
    <PromotionDetailContainer>
      <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>

      <PromotionHeaderGrid>
        {/* Left Column - Title, Dates, Description */}
        <PromotionMainInfo>
          <InfoBlock>
            <h3>TITOLO</h3>
            <p>{titolo}</p>
          </InfoBlock>
          <PromotionDates>
            <InfoBlock className="date-block">
              <h3>DATA INIZIO</h3>
              <p>{data_inizio ? formatItalianDate(data_inizio) : "N.D."}</p>
            </InfoBlock>
            <InfoBlock className="date-block">
              <h3>DATA FINE</h3>
              <p>{data_fine ? formatItalianDate(data_fine) : "N.D."}</p>
            </InfoBlock>
          </PromotionDates>
          <InfoBlock className="description-block">
            <h3>DESCRIZIONE</h3>
            <p>{descrizione || "Nessuna descrizione disponibile."}</p>
          </InfoBlock>
        </PromotionMainInfo>

        {/* Right Column - Code, Usage, Client Types */}
        <PromotionMetaInfo>
          <div className="top-meta-grid">
            <InfoBlock className="code-usage-block">
              <h3>CODICE PROMOZIONE</h3>
              <p>{codice || "N.D."}</p>
            </InfoBlock>
            <InfoBlock className="code-usage-block">
              <h3>NUMERO UTILIZZI</h3>
              <p>
                {usedCount} / {sentCount}
              </p>{" "}
              {/* Used / Sent */}
            </InfoBlock>
          </div>
          <ClientTypesInvolvedBlock>
            <h3>ELENCO TIPOLOGIE CLIENTE COINVOLTE</h3>
            {involvedClientTypes.length > 0 ? (
              <ClientTypeTagList>
                {involvedClientTypes.map((type) => (
                  <ClientTypeTag
                    key={type.id}
                    onClick={(e) => handleAssociatedTypeClick(type.id, e)}
                  >
                    {type.nome}
                  </ClientTypeTag>
                ))}
              </ClientTypeTagList>
            ) : (
              <PlaceholderText
                style={{
                  textAlign: "left",
                  padding: "10px 0",
                  fontSize: "0.9em",
                }}
              >
                Nessuna tipologia cliente associata.
              </PlaceholderText>
            )}
          </ClientTypesInvolvedBlock>
        </PromotionMetaInfo>
      </PromotionHeaderGrid>

      {/* Bottom Section - Products */}
      <ProductsSection>
        <h2>ELENCO PRODOTTI (COINVOLTI)</h2>
        <ProductListContainer>
          <ElencoProdotti products={involvedProducts} />
        </ProductListContainer>
        <AddProductButton onClick={handleAddProduct}>
          AGGIUNGI PRODOTTO
        </AddProductButton>
      </ProductsSection>
    </PromotionDetailContainer>
  );
};

export default AdminPromotionDetailPage;
