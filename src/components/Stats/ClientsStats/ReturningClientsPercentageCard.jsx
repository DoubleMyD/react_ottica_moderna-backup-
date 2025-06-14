// src/components/Stats/ReturningClientsPercentageCard.jsx
import React from 'react';
import { StatCardContainer, StatTitle, StatValue, GrowthIndicator, PlaceholderText } from '../StyledStatCards';
import { formatPercentage } from '../../../utils/formatters';
import useReturningClientsPercentage from '../../../hooks/stats/ClientsStatsHooks/useReturningClientsPercentage';

const ReturningClientsPercentageCard = () => {
  const { percentage, loading, error } = useReturningClientsPercentage();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento % Riacquisti...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Percentuale Clienti Riacquistanti</StatTitle>
      <StatValue>{formatPercentage(percentage)}</StatValue>
      <GrowthIndicator $isPositive={percentage > 0.5}>
        {/* Placeholder for arrow if you want to compare to a benchmark */}
        {/* {percentage > 0.5 ? "📈" : (percentage < 0.5 ? "📉" : "")} */}
        Dalla Base Clienti Totale
      </GrowthIndicator>
    </StatCardContainer>
  );
};

export default ReturningClientsPercentageCard;