// src/components/Stats/TotalActivePromotionsCard.jsx
import React from 'react';
import { StatCardContainer, StatTitle, StatValue, PlaceholderText } from '../StyledStatCards';
import useTotalActivePromotions from '../../../hooks/stats/PromotionsStats/useTotalActivePromotions';

const TotalActivePromotionsCard = () => {
  const { activePromotionsCount, loading, error } = useTotalActivePromotions();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Promozioni Attive...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Totale Promozioni Attive</StatTitle>
      <StatValue>{activePromotionsCount}</StatValue>
    </StatCardContainer>
  );
};

export default TotalActivePromotionsCard;