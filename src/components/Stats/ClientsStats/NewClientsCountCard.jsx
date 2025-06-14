// src/components/Stats/NewClientsCountCard.jsx
import React from 'react';
import { StatCardContainer, StatTitle, StatValue, StatSubValue, PlaceholderText } from '../StyledStatCards';
import useNewClientsCount from "../../../hooks/stats/ClientsStatsHooks/useNewClientsCount";

const NewClientsCountCard = ({ days = 30 }) => {
  const { newClientsCount, loading, error } = useNewClientsCount(days);

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Nuovi Clienti...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Nuovi Clienti (Ultimi {days} giorni)</StatTitle>
      <StatValue>{newClientsCount}</StatValue>
      <StatSubValue>periodo corrente</StatSubValue>
    </StatCardContainer>
  );
};

export default NewClientsCountCard;