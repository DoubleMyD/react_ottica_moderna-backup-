// src/components/Stats/AverageOrderValueCard.jsx
import React from 'react';
import { StatCardContainer, StatTitle, StatValue, PlaceholderText } from '../StyledStatCards';
import { formatCurrency } from '../../../utils/formatters';
import useAverageOrderValue from '../../../hooks/stats/GeneralStatsHooks/useAverageOrderValue';

const AverageOrderValueCard = () => {
  const { aov, loading, error } = useAverageOrderValue();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento AOV...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Valore Medio Transazione</StatTitle>
      <StatValue>{formatCurrency(aov)}</StatValue>
    </StatCardContainer>
  );
};

export default AverageOrderValueCard;