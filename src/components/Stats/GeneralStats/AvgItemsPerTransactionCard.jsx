// src/components/Stats/AvgItemsPerTransactionCard.jsx
import React from 'react';
import { StatCardContainer, StatTitle, StatValue, PlaceholderText } from '../StyledStatCards';
import useAvgItemsPerTransaction from "../../../hooks/stats/GeneralStatsHooks/useAvgItemsPerTransaction";

const AvgItemsPerTransactionCard = () => {
  const { avgItems, loading, error } = useAvgItemsPerTransaction();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Articoli/Transazione...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Articoli Medi per Transazione</StatTitle>
      <StatValue>{avgItems.toFixed(1)}</StatValue> {/* Display with 1 decimal place */}
    </StatCardContainer>
  );
};

export default AvgItemsPerTransactionCard;