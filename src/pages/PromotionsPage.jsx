// src/pages/PromotionsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import usePromotions from '../hooks/usePromotions';

import {
  PromotionsPageContainer,
  PromotionsTitle,
  PromotionsTable,
  TableHeaderCell,
  TableRow,
  TableCell,
  DescriptionCell,
  DetailsButton,
  NoPromotionsMessage,
} from '../styles/StyledPromotions';
import { NotFoundMessage } from '../styles/StyledProductDetails';
import { Pages } from '../data/constants';

const PromotionsPage = () => {
  const { promotions, loading, error } = usePromotions();
  const navigate = useNavigate();

  const handleDetailsClick = (promotionDocumentId) => {
    navigate(`${Pages.PROMOTIONS}/${promotionDocumentId}`);
  };

  const formatItalianDate = (dateString) => {
    if (!dateString) return 'N.D.';
    try {
      return new Date(dateString).toLocaleDateString('it-IT');
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Data non valida';
    }
  };

  // Helper function to determine promotion status
  const getPromotionStatus = (data_inizio, data_fine) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to start of day

    const startDate = data_inizio ? new Date(data_inizio) : null;
    if (startDate) startDate.setHours(0, 0, 0, 0);

    const endDate = data_fine ? new Date(data_fine) : null;
    if (endDate) endDate.setHours(0, 0, 0, 0);

    if (startDate && today < startDate) {
      return 'Futura'; // Promotion starts in the future
    } else if (endDate && today > endDate) {
      return 'Scaduta'; // Promotion has ended
    } else if (startDate && endDate && today >= startDate && today <= endDate) {
      return 'Attiva'; // Promotion is currently active
    } else if (startDate && !endDate && today >= startDate) {
        return 'Attiva'; // Active, no end date implies ongoing
    } else if (!startDate && endDate && today <= endDate) {
        return 'Attiva'; // Active, no start date implies always active until end date
    } else {
      return 'N.D.'; // Cannot determine status
    }
  };


  if (loading) {
    return (
      <PromotionsPageContainer>
        <p>Caricamento promozioni...</p>
      </PromotionsPageContainer>
    );
  }

  if (error) {
    return (
      <PromotionsPageContainer>
        <NotFoundMessage>Errore nel caricamento delle promozioni: {error}</NotFoundMessage>
      </PromotionsPageContainer>
    );
  }

  return (
    <PromotionsPageContainer>
      <PromotionsTitle>Elenco Promozioni</PromotionsTitle>

      {promotions.length === 0 ? (
        <NoPromotionsMessage>Nessuna promozione disponibile al momento.</NoPromotionsMessage>
      ) : (
        <PromotionsTable>
          {/* Table Headers */}
          <TableHeaderCell>STATO</TableHeaderCell>
          <TableHeaderCell>Titolo</TableHeaderCell>
          <TableHeaderCell>Descrizione</TableHeaderCell>
          <TableHeaderCell>Data di inizio</TableHeaderCell>
          <TableHeaderCell>Data di fine</TableHeaderCell>
          <TableHeaderCell></TableHeaderCell> {/* For Dettagli button */}

          {/* Promotion Rows */}
          {promotions.map((promo) => (
            <TableRow key={promo.id}>
              {/* Dynamically determine status */}
              <TableCell data-label="STATO">
                {getPromotionStatus(promo.data_inizio, promo.data_fine)}
              </TableCell>
              <TableCell data-label="Titolo">{promo.titolo}</TableCell>
              <DescriptionCell data-label="Descrizione">{promo.descrizione}</DescriptionCell>
              <TableCell data-label="Data di inizio">{formatItalianDate(promo.data_inizio)}</TableCell>
              <TableCell data-label="Data di fine">{formatItalianDate(promo.data_fine)}</TableCell>
              <TableCell>
                <DetailsButton onClick={() => handleDetailsClick(promo.documentId)}>
                  DETTAGLI
                </DetailsButton>
              </TableCell>
            </TableRow>
          ))}
        </PromotionsTable>
      )}
    </PromotionsPageContainer>
  );
};

export default PromotionsPage;