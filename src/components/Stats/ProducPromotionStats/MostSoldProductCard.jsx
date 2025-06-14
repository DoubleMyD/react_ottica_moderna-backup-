// src/components/Stats/MostSoldProductCard.jsx
import React from 'react';
import { StatCardContainer, StatTitle, StatValue, StatSubValue, PlaceholderText } from '../StyledStatCards';
import useMostSoldProduct from '../../../hooks/stats/ProductPromotionStatsHooks/useMostSoldProduct';

const MostSoldProductCard = () => {
  const { mostSoldProduct, loading, error } = useMostSoldProduct();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Prodotto Più Venduto...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Prodotto Più Venduto</StatTitle>
      {mostSoldProduct ? (
        <>
          <StatValue>{mostSoldProduct.nome}</StatValue>
          <StatSubValue>Totale venduto: {mostSoldProduct.totalQuantitySold} unità</StatSubValue>
        </>
      ) : (
        <PlaceholderText>Nessun dato di vendita.</PlaceholderText>
      )}
    </StatCardContainer>
  );
};

export default MostSoldProductCard;