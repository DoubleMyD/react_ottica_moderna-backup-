// src/components/Stats/MostProfitableProductTypeCard.jsx
import React from 'react';
import { StatCardContainer, StatTitle, StatValue, StatSubValue, PlaceholderText } from '../StyledStatCards';
import { formatCurrency } from "../../../utils/formatters";
import useMostProfitableProductType from "../../../hooks/stats/ProductPromotionStatsHooks/useMostProfitableProductType";

const MostProfitableProductTypeCard = () => {
  const { mostProfitableType, loading, error } = useMostProfitableProductType();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Tipologia Più Redditizia...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Tipologia Prodotto Più Redditizia</StatTitle>
      {mostProfitableType ? (
        <>
          <StatValue>{mostProfitableType.name}</StatValue>
          <StatSubValue>Ricavo: {formatCurrency(mostProfitableType.totalRevenue)}</StatSubValue>
        </>
      ) : (
        <PlaceholderText>Nessun dato di ricavo per tipologia.</PlaceholderText>
      )}
    </StatCardContainer>
  );
};

export default MostProfitableProductTypeCard;