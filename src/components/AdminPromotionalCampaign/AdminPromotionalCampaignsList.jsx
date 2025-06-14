// src/components/Marketing/PromotionalCampaignsList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CampaignsContainer,
  TopControls,
  NewCampaignButton,
  CampaignsGrid,
  CampaignCard,
  CampaignTitle,
  CampaignDetails,
  ClientTypesInvolvedList,
  ClientTypeTag,
  CampaignActionButton,
  // Import the new wrapper
  CampaignActionsWrapper, // NEW: Import CampaignActionsWrapper
  PlaceholderText,
} from "./StyledAdminPromotionalCampaignsList";

import { StatsGridContainer } from "../Stats/StyledStatCards";
import { AdminSection, Pages } from "../../data/constants";
import usePromotions from "../../hooks/usePromotions";
import { formatItalianDate } from "../../utils/formatters";
import TotalActivePromotionsCard from "../Stats/PromotionsStats/TotalActivePromotionsCard";
import AvgClientsPerPromotionCard from "../Stats/PromotionsStats/AvgClientsPerPromotionCard";
import PromotionWithMostProductsCard from "../Stats/PromotionsStats/PromotionWithMostProductsCard";
import LongestPromotionCard from "../Stats/PromotionsStats/LongestPromotionCard";
import PromotionsByClientTypeDistributionCard from "../Stats/PromotionsStats/PromotionsByClientTypeDistributionCard";

// Import the new modals
import CampaignConfirmationModal from "../../components/Modals/CampaignConfirmationModal";
import CreateCampaignModal from "../../components/Modals/CreateCampaignModal"; // NEW: Import the CreateCampaignModal
import usePromotionDetail from "../../hooks/usePromotionDetail";

const PromotionalCampaignsList = () => {
  const navigate = useNavigate();

  // State for the general list of promotions
  const { promotions, loading, error, refetchPromotions } = usePromotions();

  // State to manage the confirmation modal
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  // State to store the documentId of the promotion being launched
  const [promotionDocumentIdToLaunch, setPromotionDocumentIdToLaunch] = useState(null);

  // State to manage the CREATE campaign modal
  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);


  // Use usePromotionDetail to fetch the full data for the *selected* promotion for the launch modal
  // This will only run if promotionDocumentIdToLaunch is not null
  const {
    promotion: detailedPromotion,
    involvedProducts: detailedInvolvedProducts,
    loading: detailLoading,
    error: detailError,
  } = usePromotionDetail(promotionDocumentIdToLaunch);

  const handleAssociatedTypeClick = (typeId, event) => { // Use typeDocumentId for navigation
    event.stopPropagation();
    navigate(
      `?section=${AdminSection.Profilazione_TipologieCliente}&typeId=${typeId}`
    );
  };

  const handleNewCampaign = () => {
    setIsCreateCampaignModalOpen(true); // Open the create campaign modal
  };

  const handleCreateCampaignSuccess = () => {
    setIsCreateCampaignModalOpen(false); // Close modal
    refetchPromotions(); // Refresh list to show new campaign
    alert("Nuova campagna creata con successo!");
  };

  // This handler will now open the confirmation modal for launching an existing campaign
  const handleLaunchCampaign = (promotionDocumentId) => {
    setPromotionDocumentIdToLaunch(promotionDocumentId); // Set the ID of the promotion to load its details
    setIsConfirmationModalOpen(true); // Open the modal
  };

  // Callback when campaign email sending is successful
  const handleCampaignSentSuccess = () => {
    setIsConfirmationModalOpen(false); // Close the modal
    setPromotionDocumentIdToLaunch(null); // Clear the selected promotion
    alert("Campagna avviata con successo!");
    refetchPromotions(); // Re-fetch the list of promotions to update usage stats
  };

  const handleConfirmationModalClose = () => {
    setIsConfirmationModalOpen(false);
    setPromotionDocumentIdToLaunch(null); // Clear selected promotion when modal closes
  };

  const handleCreateCampaignModalClose = () => {
    setIsCreateCampaignModalOpen(false);
  };

  const handleViewDetailCampaign = (campaignDocumentId) => {
    navigate(`${Pages.PROMOTION_DETAIL}/${campaignDocumentId}`);
  };

  if (loading) {
    return (
      <CampaignsContainer>
        <PlaceholderText>Caricamento campagne promozionali...</PlaceholderText>
      </CampaignsContainer>
    );
  }

  if (error) {
    return (
      <CampaignsContainer>
        <PlaceholderText style={{ color: "red" }}>Errore: {error}</PlaceholderText>
      </CampaignsContainer>
    );
  }

  return (
    <CampaignsContainer>
      {/* Top Stats Grid */}
      <StatsGridContainer>
        <TotalActivePromotionsCard />
        <AvgClientsPerPromotionCard />
        <PromotionWithMostProductsCard />
        <LongestPromotionCard />
        <PromotionsByClientTypeDistributionCard />
      </StatsGridContainer>

      {/* New Campaign Button */}
      <TopControls>
        <NewCampaignButton onClick={handleNewCampaign}>
          NUOVA CAMPAGNA
        </NewCampaignButton>
      </TopControls>

      {/* Campaigns List */}
      {promotions.length === 0 ? (
        <PlaceholderText>
          Nessuna campagna promozionale disponibile.
        </PlaceholderText>
      ) : (
        <CampaignsGrid>
          {promotions.map((campaign) => {
            const now = new Date();
            const startDate = new Date(campaign.data_inizio);
            const endDate = new Date(campaign.data_fine);
            const isCampaignActive = startDate <= now && endDate >= now;
            
            return (
              <CampaignCard key={campaign.id}>
                <CampaignTitle>{campaign.titolo}</CampaignTitle>
                <CampaignDetails>
                  <p
                    style={{
                      fontSize: "0.9em",
                      color: "#555",
                      marginBottom: "15px",
                    }}
                  >
                    {campaign.descrizione}
                  </p>

                  <p style={{ fontSize: "0.85em", color: "#666" }}>
                    Inizio: {formatItalianDate(campaign.data_inizio)} <br />
                    Fine: {formatItalianDate(campaign.data_fine)}
                  </p>

                  <h4>Tipologie Cliente Coinvolte:</h4>
                  {campaign.tipologia_clientes &&
                  campaign.tipologia_clientes.length > 0 ? (
                    <ClientTypesInvolvedList>
                      {campaign.tipologia_clientes.map((type) => (
                        <ClientTypeTag
                          key={type.id}
                          onClick={(e) => handleAssociatedTypeClick(type.id, e)} // Use documentId
                        >
                          {type.nome}
                        </ClientTypeTag>
                      ))}
                    </ClientTypesInvolvedList>
                  ) : (
                    <PlaceholderText
                      style={{ fontSize: "0.9em", padding: "10px 0" }}
                    >
                      Nessuna tipologia specifica.
                    </PlaceholderText>
                  )}
                </CampaignDetails>
                <CampaignActionsWrapper>
                  <CampaignActionButton
                    $secondary
                    onClick={() => handleViewDetailCampaign(campaign.documentId)}
                  >
                    Dettagli
                  </CampaignActionButton>
                  <CampaignActionButton
                    onClick={() => handleLaunchCampaign(campaign.documentId)}
                    disabled={!isCampaignActive || isConfirmationModalOpen} // Disable if not active or launch modal is open
                  >
                    {isCampaignActive ? "AVVIA" : "NON ATTIVA"}
                  </CampaignActionButton>
                </CampaignActionsWrapper>
              </CampaignCard>
            );
          })}
        </CampaignsGrid>
      )}

      {/* Campaign Launch Confirmation Modal */}
      {isConfirmationModalOpen && (
        <CampaignConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={handleConfirmationModalClose}
          promotion={detailedPromotion}
          involvedProducts={detailedInvolvedProducts}
          onCampaignSentSuccess={handleCampaignSentSuccess}
        />
      )}

      {/* NEW: Create Campaign Modal */}
      {isCreateCampaignModalOpen && (
        <CreateCampaignModal
          isOpen={isCreateCampaignModalOpen}
          onClose={handleCreateCampaignModalClose}
          onCreateSuccess={handleCreateCampaignSuccess}
        />
      )}
    </CampaignsContainer>
  );
};

export default PromotionalCampaignsList;
