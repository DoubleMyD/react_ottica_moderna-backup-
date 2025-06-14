// src/components/Stats/SinglePromotionStats/PromotionDaysRemainingCard.jsx
import React from 'react';
import useDaysRemainingPromotion from '../../../hooks/stats/SinglePromotionStatsHooks/useDaysRemainingPromotion';
import { StatCardContainer, StatTitle, StatValue, PlaceholderText } from '../StyledStatCards';

const PromotionDaysRemainingCard = ({ promotionId }) => {
  const { daysRemaining, loading, error } = useDaysRemainingPromotion(promotionId);

  let displayValue = "N.D.";
  let textColor = "";

  if (daysRemaining !== null) {
    if (daysRemaining > 0) {
      displayValue = `${daysRemaining}`;
      textColor = 'green'; // Green for active
    } else if (daysRemaining === 0) {
      displayValue = "Oggi";
      textColor = 'orange'; // Orange for expiring today
    } else {
      displayValue = `${Math.abs(daysRemaining)}`;
      textColor = 'red'; // Red for expired
    }
  }

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Giorni Rimanenti...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Giorni Rimanenti</StatTitle>
      <StatValue style={{ color: textColor }}>{displayValue}</StatValue>
      {daysRemaining !== null && (
        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
          {daysRemaining > 0 ? "giorni alla scadenza" : (daysRemaining === 0 ? "scade oggi" : "giorni dalla scadenza")}
        </p>
      )}
    </StatCardContainer>
  );
};

export default PromotionDaysRemainingCard;