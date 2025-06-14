// src/components/Stats/LongestPromotionCard.jsx
import React from 'react';
import useLongestPromotion from '../../../hooks/stats/PromotionsStats/useLongestPromotion';
import { StatCardContainer, StatTitle, StatValue, StatSubValue, PlaceholderText } from '../StyledStatCards';

const LongestPromotionCard = () => {
  const { longestPromotion, loading, error } = useLongestPromotion();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Promozione Più Lunga...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Promozione Più Lunga</StatTitle>
      {longestPromotion ? (
        <>
          <StatValue>{longestPromotion.titolo}</StatValue>
          <StatSubValue>{longestPromotion.durationDays} giorni</StatSubValue>
        </>
      ) : (
        <PlaceholderText>Nessuna promozione con durata definita.</PlaceholderText>
      )}
    </StatCardContainer>
  );
};

export default LongestPromotionCard;