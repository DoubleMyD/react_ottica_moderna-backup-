// src/components/Stats/PromotionsByClientTypeDistributionCard.jsx
import React from 'react';
import usePromotionsByClientTypeDistribution from '../../../hooks/stats/PromotionsStats/usePromotionsByClientTypeDistribution';
import { StatCardContainer, StatTitle, PlaceholderText } from '../StyledStatCards';

const PromotionsByClientTypeDistributionCard = () => {
  const { distribution, loading, error } = usePromotionsByClientTypeDistribution();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Distribuzione Promozioni...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  // Show top 3 or all if less than 3
  const topDistribution = distribution.slice(0, 3);

  return (
    <StatCardContainer style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <StatTitle>Distribuzione Promozioni per Tipologia Cliente</StatTitle>
      {topDistribution.length > 0 && topDistribution.some(d => d.count > 0) ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0', width: '100%' }}>
          {topDistribution.map((item, index) => (
            <li key={item.type || index} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dotted #eee', fontSize: '0.95rem' }}>
              <span style={{ color: item.count > 0 ? '#333' : '#999' }}>{item.type}</span>
              <span style={{ fontWeight: 'bold', color: '#007BFF' }}>{item.count} Promozioni</span>
            </li>
          ))}
        </ul>
      ) : (
        <PlaceholderText>Nessuna promozione associata a tipologie cliente.</PlaceholderText>
      )}
    </StatCardContainer>
  );
};

export default PromotionsByClientTypeDistributionCard;