// src/components/Stats/SinglePromotionStats/PromotionAverageDiscountCard.jsx
import React from 'react';
import useAverageDiscountValue from '../../../hooks/stats/SinglePromotionStatsHooks/useAverageDiscountValue';
import { StatCardContainer, StatTitle, StatValue, StatSubValue, PlaceholderText } from '../StyledStatCards';
import { formatCurrency } from '../../../utils/formatters';

const PromotionAverageDiscountCard = ({ promotionId }) => {
  const { averageDiscount, loading, error } = useAverageDiscountValue(promotionId);

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Sconto Medio...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Sconto Medio Offerto</StatTitle>
      <StatValue>{formatCurrency(averageDiscount)}</StatValue>
      <StatSubValue>per articolo</StatSubValue>
    </StatCardContainer>
  );
};

export default PromotionAverageDiscountCard;