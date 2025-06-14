// src/styles/Stats/StyledStatCards.js
import styled from "styled-components";
import { Colors } from "../../styles/colors";

// NEW: A simple container for the stats grid
export const StatsGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
  background-color: ${Colors.background};
  border-radius: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 15px;
    gap: 15px;
  }
`;

export const StatCardContainer = styled.div`
  background-color: ${Colors.white};
  border: 1px solid ${Colors.lightBorder};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 150px; /* Ensure consistent height for cards */
  justify-content: center; /* Vertically center content */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 15px;
    min-height: 120px;
  }
`;

export const StatTitle = styled.h3`
  font-size: 1.1rem;
  color: ${Colors.mediumGray};
  margin-bottom: 10px;
  font-weight: 600;
  white-space: nowrap; /* Prevent title from wrapping */
  overflow: hidden;
  text-overflow: ellipsis; /* Add ellipsis if too long */

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 8px;
  }
`;

export const StatValue = styled.p`
  font-size: 2.5rem; /* Large and prominent */
  font-weight: 700;
  color: ${Colors.darkSectionTitle};
  margin: 0; /* Remove default paragraph margin */
  line-height: 1; /* Tighten line height */

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const StatSubValue = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${Colors.greyText};
  margin-top: 5px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const GrowthIndicator = styled.span`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 8px;

  color: ${(props) =>
    props.$isPositive ? Colors.accentGreen : Colors.accentRed};

  svg {
    margin-right: 5px;
  }
`;

export const PlaceholderText = styled.p`
  color: ${Colors.greyText};
  font-style: italic;
  font-size: 0.9rem;
`;
