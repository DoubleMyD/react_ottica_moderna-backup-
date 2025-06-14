// src/components/Stats/PromotionWithMostProductsCard.jsx
import React from 'react';
import usePromotionWithMostProducts from '../../../hooks/stats/PromotionsStats/usePromotionWithMostProducts';
import { StatCardContainer, StatTitle, StatValue, StatSubValue, PlaceholderText } from '../StyledStatCards';

const PromotionWithMostProductsCard = () => {
  const { promotion, loading, error } = usePromotionWithMostProducts();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Promo con Più Prodotti...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Promozione con Più Prodotti Coinvolti</StatTitle>
      {promotion ? (
        <>
          <StatValue>{promotion.titolo}</StatValue>
          <StatSubValue>{promotion.productCount} prodotti</StatSubValue>
        </>
      ) : (
        <PlaceholderText>Nessuna promozione con prodotti.</PlaceholderText>
      )}
    </StatCardContainer>
  );
};

export default PromotionWithMostProductsCard;