// src/components/Stats/PromotionUsageRateCard.jsx
import React from 'react';
import { StatCardContainer, StatTitle, StatValue, StatSubValue, PlaceholderText } from '../StyledStatCards';
import { formatPercentage } from '../../../utils/formatters';
import usePromotionUsageRate from "../../../hooks/stats/ProductPromotionStatsHooks/usePromotionUsageRate";

const PromotionUsageRateCard = () => {
  const { usageRate, totalSent, totalUsed, loading, error } = usePromotionUsageRate();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Tasso Utilizzo Promozioni...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Tasso di Utilizzo Promozioni</StatTitle>
      <StatValue>{formatPercentage(usageRate)}</StatValue>
      <StatSubValue>{totalUsed} / {totalSent} utilizzate</StatSubValue>
    </StatCardContainer>
  );
};

export default PromotionUsageRateCard;