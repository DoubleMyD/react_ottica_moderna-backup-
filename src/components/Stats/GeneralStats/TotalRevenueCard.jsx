// src/components/Stats/TotalRevenueCard.jsx
import React from 'react';
import { StatCardContainer, StatTitle, StatValue, PlaceholderText } from '../StyledStatCards';
import { formatCurrency } from "../../../utils/formatters"; // Your formatter
import useTotalRevenue from "../../../hooks/stats/GeneralStatsHooks/useTotalRevenue";

const TotalRevenueCard = () => {
  const { totalRevenue, loading, error } = useTotalRevenue();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Ricavo...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Ricavo Totale</StatTitle>
      <StatValue>{formatCurrency(totalRevenue)}</StatValue>
    </StatCardContainer>
  );
};

export default TotalRevenueCard;