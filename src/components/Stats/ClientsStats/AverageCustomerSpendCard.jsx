// src/components/Stats/AverageCustomerSpendCard.jsx
import React from 'react';
import { StatCardContainer, StatTitle, StatValue, PlaceholderText } from '../StyledStatCards';
import { formatCurrency } from "../../../utils/formatters";
import useAverageCustomerSpend from "../../../hooks/stats/ClientsStatsHooks/useAverageCustomerSpend";

const AverageCustomerSpendCard = () => {
  const { averageSpend, loading, error } = useAverageCustomerSpend();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Spesa Media...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Spesa Media per Cliente</StatTitle>
      <StatValue>{formatCurrency(averageSpend)}</StatValue>
    </StatCardContainer>
  );
};

export default AverageCustomerSpendCard;