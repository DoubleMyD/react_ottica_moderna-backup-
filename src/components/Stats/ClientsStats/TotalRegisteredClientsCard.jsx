// src/components/Stats/TotalRegisteredClientsCard.jsx
import React from 'react';
import { StatCardContainer, StatTitle, StatValue, PlaceholderText } from '../StyledStatCards';
import useTotalRegisteredClients from '../../../hooks/stats/ClientsStatsHooks/useTotalRegisteredClients';

const TotalRegisteredClientsCard = () => {
  const { totalClients, loading, error } = useTotalRegisteredClients();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Clienti Totali...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Totale Clienti Registrati</StatTitle>
      <StatValue>{totalClients}</StatValue>
    </StatCardContainer>
  );
};

export default TotalRegisteredClientsCard;