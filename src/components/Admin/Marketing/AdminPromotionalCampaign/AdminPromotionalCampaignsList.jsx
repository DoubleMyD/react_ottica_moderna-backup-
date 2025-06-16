// src/components/Marketing/PromotionalCampaignsList.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CampaignActionButton,
  // Import the new wrapper
  CampaignActionsWrapper,
  CampaignCard,
  CampaignDetails,
  CampaignsContainer,
  CampaignsGrid,
  CampaignTitle,
  ClientTypesInvolvedList,
  ClientTypeTag,
  NewCampaignButton, // NEW: Import CampaignActionsWrapper
  PlaceholderText,
  TopControls,
} from "./StyledAdminPromotionalCampaignsList";

import { AdminSection, Pages } from "../../../../data/constants";
import usePromotions from "../../../../hooks/usePromotions";
import {formatItalianDate} from "../../../../utils/formatters";


import AvgClientsPerPromotionCard from "../../../Stats/PromotionsStats/AvgClientsPerPromotionCard";
import TotalActivePromotionsCard from "../../../Stats/PromotionsStats/TotalActivePromotionsCard";
import LongestPromotionCard from "../../../Stats/PromotionsStats/LongestPromotionCard";
import PromotionsByClientTypeDistributionCard from "../../../Stats/PromotionsStats/PromotionsByClientTypeDistributionCard";
import PromotionWithMostProductsCard from "../../../Stats/PromotionsStats/PromotionWithMostProductsCard";

// Import the new modals
import DeletePromotionButton from "../DeletePromotionButton";
import CampaignFormModal from "../../Marketing/CampaignFormModal";
import CampaignConfirmationModal from "../../../Modals/CampaignConfirmationModal";
import EditPromotionButton from "../../Marketing/EditPromotionButton";
import usePromotionDetail from "../../../../hooks/usePromotionDetail";
import { StatsGridContainer } from "../../../Stats/StyledStatCards";

const PromotionalCampaignsList = () => {
  const navigate = useNavigate();

  const { promotions, loading, error, refetchPromotions } = usePromotions();

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [promotionDocumentIdToLaunch, setPromotionDocumentIdToLaunch] =
    useState(null);
  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] =
    useState(false);

  const {
    promotion: detailedPromotion,
    involvedProducts: detailedInvolvedProducts,
    loading: detailLoading,
    error: detailError,
  } = usePromotionDetail(promotionDocumentIdToLaunch);

  const handleAssociatedTypeClick = (typeDocumentId, event) => {
    event.stopPropagation();
    navigate(
      `?section=${AdminSection.Profilazione_TipologieCliente}&typeId=${typeDocumentId}`
    );
  };

  const handleNewCampaign = () => {
    setIsCreateCampaignModalOpen(true);
  };

  const handleCreateCampaignSuccess = () => {
    setIsCreateCampaignModalOpen(false);
    refetchPromotions();
    // alert("Nuova campagna creata con successo!"); // Alert is now handled inside CampaignFormModal
  };

  const handleLaunchCampaign = (promotionDocumentId) => {
    setPromotionDocumentIdToLaunch(promotionDocumentId);
    setIsConfirmationModalOpen(true);
  };

  const handleCampaignSentSuccess = () => {
    setIsConfirmationModalOpen(false);
    setPromotionDocumentIdToLaunch(null);
    alert("Campagna avviata con successo!");
    refetchPromotions();
  };

  const handleConfirmationModalClose = () => {
    setIsConfirmationModalOpen(false);
    setPromotionDocumentIdToLaunch(null);
  };

  const handleCreateCampaignModalClose = () => {
    setIsCreateCampaignModalOpen(false);
  };

  // Callback for edit/delete success, simply refetch the list
  const handleActionSuccess = () => {
    refetchPromotions();
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
        <PlaceholderText style={{ color: "red" }}>
          Errore: {error}
        </PlaceholderText>
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
                          onClick={(e) =>
                            handleAssociatedTypeClick(type.documentId, e)
                          }
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
                    onClick={() =>
                      handleViewDetailCampaign(campaign.documentId)
                    }
                  >
                    Dettagli
                  </CampaignActionButton>
                  <CampaignActionButton
                    onClick={() => handleLaunchCampaign(campaign.documentId)}
                    disabled={!isCampaignActive || isConfirmationModalOpen}
                  >
                    {isCampaignActive ? "AVVIA" : "NON ATTIVA"}
                  </CampaignActionButton>
                </CampaignActionsWrapper>
                {/* NEW: Reusable Edit and Delete Buttons */}
                <CampaignActionsWrapper>
                  <EditPromotionButton
                    promotion={campaign}
                    onEditSuccess={handleActionSuccess}
                    showText={false}
                  />
                  <DeletePromotionButton
                    promotion={campaign}
                    onDeleteSuccess={handleActionSuccess}
                  />
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

      {/* Create Campaign Modal */}
      {isCreateCampaignModalOpen && (
        <CampaignFormModal
          isOpen={isCreateCampaignModalOpen}
          onClose={handleCreateCampaignModalClose}
          onSuccess={handleCreateCampaignSuccess}
          initialData={null} // Ensure it's in create mode
        />
      )}
    </CampaignsContainer>
  );
};

export default PromotionalCampaignsList;
