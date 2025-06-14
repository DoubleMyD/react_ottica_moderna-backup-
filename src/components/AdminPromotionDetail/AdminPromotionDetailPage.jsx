// src/pages/PromotionDetailPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usePromotionDetail from "../../hooks/usePromotionDetail"; // The new hook
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


import { Colors } from "../../styles/colors";
import styled from "styled-components";

// Import the new single-promotion stat cards
import PromotionClientsReachedCard from "../Stats/SinglePromotionStats/PromotionClientsReachedCard";
import PromotionUniqueProductsCard from "../Stats/SinglePromotionStats/PromotionUniqueProductsCard";
import PromotionAverageDiscountCard from "../Stats/SinglePromotionStats/PromotionAverageDiscountCard";
import PromotionDaysRemainingCard from "../Stats/SinglePromotionStats/PromotionDaysRemainingCard";
import PromotionMostActiveClientTypeCard from "../Stats/SinglePromotionStats/PromotionMostActiveClientTypeCard";
import MostSoldProductCard from "../Stats/ProducPromotionStats/MostSoldProductCard";
import MostProfitableProductTypeCard from "../Stats/ProducPromotionStats/MostProfitableProductTypeCard";
import TopContributingBrandCard from "../Stats/ProducPromotionStats/TopContributingBrandCard";
import SalesSeasonalityCard from "../Stats/ProducPromotionStats/SalesSeasonalityCard";
import PromotionUsageRateCard from "../Stats/ProducPromotionStats/PromotionUsageRateCard";
import StartCampaignButton from "../AdminPromotionalCampaign/StartCampaignButton";
import CampaignConfirmationModal from "../Modals/CampaignConfirmationModal";


// A dedicated container for the single promotion stats grid
const PromotionStatsGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  background-color: ${Colors.background};
  border-radius: 12px;
  margin-top: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 15px;
    gap: 15px;
  }
`;

const AdminPromotionDetailPage = () => {
  const { documentId: promotionDocumentId } = useParams(); // Get promotion DocumentId from URL
  const navigate = useNavigate();

  // Fetch core promotion data and involved products. Added refetch.
  const { promotion, involvedProducts, loading, error, refetch: refetchPromotionDetails } =
    usePromotionDetail(promotionDocumentId);

  // Fetch promotion usage statistics using the promotion's Strapi internal ID. Added refetch.
  const {
    sentCount,
    usedCount,
    loading: usageStatsLoading,
    error: usageStatsError,
    refetchUsageStats,
  } = usePromotionUsageStats(promotion?.id); // Pass promotion.id only when available

  // State for the confirmation modal
  const [isCampaignConfirmationModalOpen, setIsCampaignConfirmationModalOpen] = useState(false);

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

  // Handler to open the campaign confirmation modal
  const handleStartCampaignClick = () => {
    // Only allow starting campaign if promotion data is loaded and has a valid ID
    if (promotion && promotion.id) {
      setIsCampaignConfirmationModalOpen(true);
    } else {
      alert("Impossibile avviare la campagna: dati promozione non disponibili.");
    }
  };

  // Callback when campaign email sending is successful
  const handleCampaignSentSuccess = () => {
    setIsCampaignConfirmationModalOpen(false); // Close the modal
    alert("Campagna avviata con successo!");
    // After campaign is sent, refresh usage stats to see updated "sent" count
    refetchUsageStats();
    // Potentially refetch promotion details if any fields related to campaign status are added
    refetchPromotionDetails();
  };


  if (loading || usageStatsLoading) {
    return (
      <PromotionDetailContainer>
        <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>
        <PlaceholderText>Caricamento dettagli promozione...</PlaceholderText>
      </PromotionDetailContainer>
    );
  }

  if (error || usageStatsError) {
    return (
      <PromotionDetailContainer>
        <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>
        <PlaceholderText style={{ color: "red" }}>
          Errore: {error || usageStatsError}
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
    id: strapiPromotionId,
    titolo,
    descrizione,
    data_inizio,
    data_fine,
    codice,
    tipologia_clientes, // Populated client types
  } = promotion;

  // Map client types for rendering tags
  const involvedClientTypes =
    tipologia_clientes?.map((type) => ({
      id: type.id,
      documentId: type.documentId,
      nome: type.nome,
    })) || [];

  // Determine if the promotion is currently active based on dates
  const now = new Date();
  const startDate = new Date(data_inizio);
  const endDate = new Date(data_fine);
  const isPromotionActive = startDate <= now && endDate >= now;


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
                    onClick={(e) => handleAssociatedTypeClick(type.documentId, e)}
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

      {/* Button to start campaign - Conditionally rendered based on promotion activity */}
      {isPromotionActive ? (
        <StartCampaignButton
          onClick={handleStartCampaignClick}
          // Disable button if modal is open to prevent double clicks/conflicts
          disabled={isCampaignConfirmationModalOpen}
        />
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px', color: Colors.mediumGray, fontWeight: 'bold' }}>
          La promozione non è attiva in questo momento (fuori data).
        </p>
      )}


      {/* Stats specific to this single promotion */}
      {/* Pass strapiPromotionId to each new stat card */}
      <PromotionStatsGridContainer>
        <PromotionClientsReachedCard promotionId={strapiPromotionId} />
        <PromotionUniqueProductsCard promotionId={strapiPromotionId} />
        <PromotionAverageDiscountCard promotionId={strapiPromotionId} />
        <PromotionDaysRemainingCard promotionId={strapiPromotionId} />
        <PromotionMostActiveClientTypeCard promotionId={strapiPromotionId} />
      </PromotionStatsGridContainer>

      {/* Bottom Section - Products */}
      <ProductsSection>
        <h2>ELENCO PRODOTTI (COINVOLTI)</h2>
        <ProductListContainer>
          <ElencoProdotti
            products={involvedProducts}
            isInPromotionContext={true} // Indicate that products are shown within a promotion context
          />
        </ProductListContainer>
        <AddProductButton onClick={handleAddProduct}>
          AGGIUNGI PRODOTTO
        </AddProductButton>
      </ProductsSection>

      {/* Campaign Confirmation Modal */}
      <CampaignConfirmationModal
        isOpen={isCampaignConfirmationModalOpen}
        onClose={() => setIsCampaignConfirmationModalOpen(false)} // Close handler for modal
        promotion={promotion} // Pass the full promotion object
        involvedProducts={involvedProducts} // Pass involved products for email content
        onCampaignSentSuccess={handleCampaignSentSuccess} // Callback for success
      />
    </PromotionDetailContainer>
  );
};

export default AdminPromotionDetailPage;
