// src/components/Stats/TotalTransactionsCard.jsx
import React from 'react';
import { StatCardContainer, StatTitle, StatValue, PlaceholderText } from '../StyledStatCards';
import useTotalTransactions from '../../../hooks/stats/GeneralStatsHooks/useTotalTransactions';

const TotalTransactionsCard = () => {
  const { totalTransactions, loading, error } = useTotalTransactions();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Transazioni...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Totale Transazioni</StatTitle>
      <StatValue>{totalTransactions}</StatValue>
    </StatCardContainer>
  );
};

export default TotalTransactionsCard;