// src/styles/StyledClientHeaderSection.js
import styled from "styled-components";
import { Colors } from "../../../styles/colors";

export const ClientHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(200px, 1fr)
  ); /* Responsive columns */
  gap: 15px;
  padding-bottom: 25px;
  border-bottom: 1px solid ${Colors.separatorSubtle};
  margin-top: 20px; /* Space for back button */

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack columns on mobile */
    gap: 10px;
    padding-bottom: 15px;
    margin-top: 15px;
  }
`;

export const ClientInfoBlock = styled.div`
  background-color: ${Colors.lightBackground};
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 80px; /* Ensure consistent height */

  h3 {
    font-size: 0.9rem;
    color: ${Colors.mediumGray};
    margin-bottom: 5px;
    font-weight: 500;
  }

  p {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${Colors.darkText};
  }

  /* Specific styles for multi-line blocks (e.g., Indirizzo) */
  &.full-width {
    grid-column: span 2; /* Span two columns */
    @media (max-width: 768px) {
      grid-column: span 1; /* Back to single column on mobile */
    }
  }

  /* Distinctive style for 'Totale Speso Negozio' */
  &.total-spent {
    background-color: ${Colors.secondaryBackground}; /* A slightly different background */
    border: 1px solid ${Colors.primaryBlue};
    p {
      color: ${Colors.primaryBlue};
      font-size: 1.3rem;
      font-weight: 700;
    }
  }

  /* Distinctive style for 'Tipologie Cliente' */
  &.client-types {
    background-color: ${Colors.tertiaryBackground}; /* Another distinct background */
    border: 1px solid ${Colors.accentGreen};
    h3 {
      color: ${Colors.darkText};
    }
  }
`;

export const FilterTagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  justify-content: center; /* Center tags within the block */
`;

export const FilterTag = styled.span`
  background-color: ${Colors.primaryBlue};
  color: ${Colors.lightText};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background-color: ${Colors.darkBlue};
    transform: translateY(-2px); /* Slight lift effect */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;
