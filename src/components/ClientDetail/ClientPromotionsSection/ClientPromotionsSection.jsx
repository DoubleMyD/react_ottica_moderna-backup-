// src/components/ClientDetail/ClientPromotionsSection.jsx
import React from "react";
import useClientPromotions from "../../../hooks/useClientPromotions";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import {
  SectionCard,
  SectionTitle,
  SectionContent,
  PromotionListItem, // NEW: Specific style for list items
  PlaceholderText,
  // If you decide to keep FilterTagContainer/FilterTag here for client types, import them:
  // FilterTagContainer, FilterTag
} from "./StyledClientPromotionsSection"; // Import from new style file
import { formatItalianDate } from "../../../utils/formatters";
import { Pages } from "../../../data/constants";

const ClientPromotionsSection = ({ clientId, clientTypes }) => {
  // clientTypes is passed from ClientDetailPage
  const navigate = useNavigate();

  const { relevantPromotions, loading, error } = useClientPromotions(clientId);

  const handlePromotionClick = (promotionDocumentId) => {
    // Navigate to a promotion detail page (e.g., /promotions/:documentId)
    if (promotionDocumentId) {
      navigate(`${Pages.PROMOTION_DETAIL}/${promotionDocumentId}`); // Adjust this path as per your routing
    }
  };

  if (loading) {
    return (
      <SectionCard>
        <SectionTitle>Promozioni</SectionTitle>
        <PlaceholderText>Caricamento promozioni...</PlaceholderText>
      </SectionCard>
    );
  }

  if (error) {
    return (
      <SectionCard>
        <SectionTitle>Promozioni</SectionTitle>
        <PlaceholderText style={{ color: "red" }}>
          Errore: {error}
        </PlaceholderText>
      </SectionCard>
    );
  }

  return (
    <SectionCard>
      <SectionTitle>Promozioni</SectionTitle>
      <SectionContent>
        {/* Client types are now displayed in ClientHeaderSection */}
        {/* {clientTypes && clientTypes.length > 0 && (
          <>
            <h3>Tipologie Cliente:</h3>
            <FilterTagContainer>
              {clientTypes.map(type => (
                <FilterTag key={type.id}>{type.nome}</FilterTag>
              ))}
            </FilterTagContainer>
          </>
        )} */}

        {relevantPromotions && relevantPromotions.length > 0 ? (
          <ul>
            {relevantPromotions.map((promo) => (
              <PromotionListItem
                key={promo.id}
                onClick={() => handlePromotionClick(promo.documentId)} // Use documentId for navigation
                $used={promo.data_utilizzo !== null}
              >
                {promo.immagine && (
                  <img src={promo.immagine} alt={promo.titolo} />
                )}
                <div>
                  <strong>{promo.titolo}</strong>
                  <p>{promo.descrizione?.substring(0, 100)}...</p>
                  <div className="date-info">
                    {promo.data_invio &&
                      `Inviata il: ${formatItalianDate(promo.data_invio)}`}
                    {promo.data_utilizzo && (
                      <strong>
                        Utilizzata il: 
                        {formatItalianDate(promo.data_utilizzo)}
                      </strong>
                    )}
                  </div>
                </div>
              </PromotionListItem>
            ))}
          </ul>
        ) : (
          <PlaceholderText>
            Nessuna promozione rilevante trovata.
          </PlaceholderText>
        )}
      </SectionContent>
    </SectionCard>
  );
};

export default ClientPromotionsSection;
