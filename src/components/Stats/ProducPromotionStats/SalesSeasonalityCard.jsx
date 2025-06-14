// src/components/Stats/SalesSeasonalityCard.jsx
import React from "react";
import {
  StatCardContainer,
  StatTitle,
  StatSubValue,
  PlaceholderText,
} from "../StyledStatCards";
import { formatCurrency } from "../../../utils/formatters";
import useSalesSeasonality from "../../../hooks/stats/ProductPromotionStatsHooks/useSalesSeasonality";

const SalesSeasonalityCard = () => {
  const { seasonalityData, loading, error } = useSalesSeasonality();

  if (loading) {
    return (
      <StatCardContainer>
        <PlaceholderText>Caricamento Stagionalità Vendite...</PlaceholderText>
      </StatCardContainer>
    );
  }
  if (error) {
    return (
      <StatCardContainer>
        <PlaceholderText style={{ color: "red" }}>
          Errore: {error}
        </PlaceholderText>
      </StatCardContainer>
    );
  }

  // Sort by revenue for display, or maintain fixed order
  const sortedData = [...seasonalityData].sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  );

  return (
    <StatCardContainer
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <StatTitle>Stagionalità delle Vendite</StatTitle>
      {seasonalityData.length > 0 &&
      seasonalityData.some((s) => s.totalRevenue > 0) ? (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "10px 0",
            width: "100%",
          }}
        >
          {sortedData.map((season, index) => (
            <li
              key={season.season}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px 0",
                borderBottom: "1px dotted #eee",
                fontSize: "0.95rem",
              }}
            >
              <span
                style={{ color: season.totalRevenue > 0 ? "#333" : "#999" }}
              >
                {season.season}
              </span>
              <span style={{ fontWeight: "bold", color: "#007BFF" }}>
                {formatCurrency(season.totalRevenue)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <PlaceholderText>Nessun dato di vendita stagionale.</PlaceholderText>
      )}
    </StatCardContainer>
  );
};

export default SalesSeasonalityCard;
