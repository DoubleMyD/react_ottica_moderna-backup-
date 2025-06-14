// src/components/Stats/SinglePromotionStats/PromotionMostActiveClientTypeCard.jsx
import React from 'react';
import useMostActiveClientTypeForPromotion from '../../../hooks/stats/SinglePromotionStatsHooks/useMostActiveClientTypeForPromotion';
import { StatCardContainer, StatTitle, StatValue, StatSubValue, PlaceholderText } from '../StyledStatCards';

const PromotionMostActiveClientTypeCard = ({ promotionId }) => {
  const { mostActiveType, loading, error } = useMostActiveClientTypeForPromotion(promotionId);

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Tipologia Cliente Più Attiva...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Tipologia Cliente Più Attiva</StatTitle>
      {mostActiveType ? (
        <>
          <StatValue>{mostActiveType.name}</StatValue>
          <StatSubValue>{mostActiveType.usageCount} utilizzi</StatSubValue>
        </>
      ) : (
        <PlaceholderText>Nessun utilizzo registrato.</PlaceholderText>
      )}
    </StatCardContainer>
  );
};

export default PromotionMostActiveClientTypeCard;