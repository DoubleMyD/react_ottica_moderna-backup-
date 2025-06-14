// src/components/Stats/TopContributingBrandCard.jsx
import React from 'react';
import { StatCardContainer, StatTitle, StatValue, StatSubValue, PlaceholderText } from '../StyledStatCards';
import { formatCurrency } from '../../../utils/formatters';
import useTopContributingBrand from '../../../hooks/stats/ProductPromotionStatsHooks/useTopContributingBrand';

const TopContributingBrandCard = () => {
  const { topBrand, loading, error } = useTopContributingBrand();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Brand Top...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Brand con Maggior Contributo</StatTitle>
      {topBrand ? (
        <>
          <StatValue>{topBrand.name}</StatValue>
          <StatSubValue>Ricavo: {formatCurrency(topBrand.totalRevenue)}</StatSubValue>
        </>
      ) : (
        <PlaceholderText>Nessun dato di ricavo per brand.</PlaceholderText>
      )}
    </StatCardContainer>
  );
};

export default TopContributingBrandCard;