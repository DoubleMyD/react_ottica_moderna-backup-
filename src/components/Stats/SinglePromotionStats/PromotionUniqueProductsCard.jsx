// src/components/Stats/SinglePromotionStats/PromotionUniqueProductsCard.jsx
import React from 'react';
import useUniqueProductsInPromotion from '../../../hooks/stats/SinglePromotionStatsHooks/useUniqueProductsInPromotion';
import { StatCardContainer, StatTitle, StatValue, PlaceholderText } from '../StyledStatCards';

const PromotionUniqueProductsCard = ({ promotionId }) => {
  const { uniqueProductCount, loading, error } = useUniqueProductsInPromotion(promotionId);

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Prodotti Coinvolti...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Prodotti Unici Coinvolti</StatTitle>
      <StatValue>{uniqueProductCount}</StatValue>
    </StatCardContainer>
  );
};

export default PromotionUniqueProductsCard;