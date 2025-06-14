// src/components/Stats/SinglePromotionStats/PromotionClientsReachedCard.jsx
import React from 'react';
import usePromotionClientsReached from '../../../hooks/stats/SinglePromotionStatsHooks/usePromotionClientsReached';
import { StatCardContainer, StatTitle, StatValue, PlaceholderText } from '../StyledStatCards';

const PromotionClientsReachedCard = ({ promotionId }) => {
  const { totalClientsReached, loading, error } = usePromotionClientsReached(promotionId);

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Clienti Raggiunti...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Clienti Unici Raggiunti</StatTitle>
      <StatValue>{totalClientsReached}</StatValue>
    </StatCardContainer>
  );
};

export default PromotionClientsReachedCard;