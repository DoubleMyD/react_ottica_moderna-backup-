// src/components/Marketing/PromotionalCampaignsList.jsx
import React, { useEffect } from "react";
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
import { AdminSection, Pages } from "../../data/constants";
import usePromotions from "../../hooks/usePromotions";
import { formatItalianDate } from "../../utils/formatters";

const PromotionalCampaignsList = () => {
  const navigate = useNavigate();

  const { promotions, loading, error } = usePromotions();

  const handleAssociatedTypeClick = (typeId, event) => {
    event.stopPropagation();
    navigate(
      `?section=${AdminSection.Profilazione_TipologieCliente}&typeId=${typeId}`
    );
  };

  const handleNewCampaign = () => {
    alert("Funzione 'Nuova Campagna' non implementata!");
  };

  const handleLaunchCampaign = (campaignDocumentId) => {
    alert(`Avvia campagna con Document ID: ${campaignDocumentId}`);
  };

  // Assume handleViewDetailCampaign is also defined somewhere or passed down
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
        <PlaceholderText style={{ color: "red" }}>{error}</PlaceholderText>
      </CampaignsContainer>
    );
  }

  return (
    <CampaignsContainer>
      <TopControls>
        <NewCampaignButton onClick={handleNewCampaign}>
          NUOVA CAMPAGNA
        </NewCampaignButton>
      </TopControls>

      {promotions.length === 0 ? (
        <PlaceholderText>
          Nessuna campagna promozionale disponibile.
        </PlaceholderText>
      ) : (
        <CampaignsGrid>
          {promotions.map((campaign) => (
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
                          handleAssociatedTypeClick(type.id, e)
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
              {/* NEW: Use the CampaignActionsWrapper for buttons */}
              <CampaignActionsWrapper>
                {/* Assuming AdminActionButton is imported or defined if used here */}
                {/* If you are using CampaignActionButton for both, use it consistently */}
                <CampaignActionButton
                  $secondary
                  onClick={() => handleViewDetailCampaign(campaign.documentId)}
                >
                  Dettagli
                </CampaignActionButton>
                <CampaignActionButton
                  onClick={() => handleLaunchCampaign(campaign.documentId)}
                >
                  AVVIA
                </CampaignActionButton>
              </CampaignActionsWrapper>
            </CampaignCard>
          ))}
        </CampaignsGrid>
      )}
    </CampaignsContainer>
  );
};

export default PromotionalCampaignsList;
