// src/components/Stats/MonthlyRevenueGrowthCard.jsx
import React from 'react';
import { StatCardContainer, StatTitle, StatValue, StatSubValue, GrowthIndicator, PlaceholderText } from '../StyledStatCards';
import { formatCurrency, formatPercentage } from "../../../utils/formatters";
import useMonthlyRevenueGrowth from "../../../hooks/stats/GeneralStatsHooks/useMonthlyRevenueGrowth";

const MonthlyRevenueGrowthCard = () => {
  const { growthPercentage, currentMonthRevenue, prevMonthRevenue, loading, error } = useMonthlyRevenueGrowth();

  const isPositiveGrowth = growthPercentage > 0;
  const growthArrow = isPositiveGrowth ? "↑" : (growthPercentage < 0 ? "↓" : "");

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Crescita...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  return (
    <StatCardContainer>
      <StatTitle>Crescita Ricavo Mensile</StatTitle>
      <StatValue>{formatCurrency(currentMonthRevenue)}</StatValue>
      {/* Display percentage and arrow only if there's a previous month's revenue to compare */}
      {prevMonthRevenue > 0 || currentMonthRevenue > 0 ? (
        <GrowthIndicator $isPositive={isPositiveGrowth}>
          {growthArrow} {formatPercentage(Math.abs(growthPercentage))}
        </GrowthIndicator>
      ) : (
        <StatSubValue>Dati insufficienti per crescita</StatSubValue>
      )}
      <StatSubValue>vs. {formatCurrency(prevMonthRevenue)} Mese Precedente</StatSubValue>
    </StatCardContainer>
  );
};

export default MonthlyRevenueGrowthCard;