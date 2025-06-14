// src/components/Stats/AvgClientsPerPromotionCard.jsx
import React from 'react';
import useAvgClientsPerPromotion from '../../../hooks/stats/PromotionsStats/useAvgClientsPerPromotion';
import { StatCardContainer, StatTitle, StatValue, StatSubValue, PlaceholderText } from '../StyledStatCards';

const AvgClientsPerPromotionCard = () => {
  const { avgClients, loading, error } = useAvgClientsPerPromotion();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Media Clienti per Promo...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Media Clienti Coinvolti per Promozione</StatTitle>
      <StatValue>{avgClients.toFixed(1)}</StatValue>
      <StatSubValue>clienti unici</StatSubValue>
    </StatCardContainer>
  );
};

export default AvgClientsPerPromotionCard;