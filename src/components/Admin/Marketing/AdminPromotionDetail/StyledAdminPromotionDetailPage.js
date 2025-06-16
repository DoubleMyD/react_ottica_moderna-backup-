// src/styles/StyledPromotionDetailPage.js
import styled from "styled-components";
import { Colors } from "../../../../styles/colors";

export const PromotionDetailContainer = styled.div`
  background-color: ${Colors.background};
  padding: 40px;
  margin: 40px auto;
  max-width: 1200px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  font-family: "Inter", sans-serif;
  color: ${Colors.darkText};
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative;

  @media (max-width: 1024px) {
    padding: 25px;
    margin: 20px auto;
  }
  @media (max-width: 768px) {
    padding: 15px;
    margin: 15px;
    box-shadow: none;
  }
`;

export const BackArrowButton = styled.button`
  position: absolute;
  top: 25px;
  left: 25px;
  background: none;
  border: none;
  font-size: 2.5rem;
  color: ${Colors.darkText};
  cursor: pointer;
  padding: 5px;
  line-height: 1;
  transition: color 0.2s ease, transform 0.2s ease;
  z-index: 10;

  &:hover {
    color: ${Colors.primaryBlue};
    transform: translateX(-5px);
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    top: 15px;
    left: 15px;
  }
`;

export const PromotionHeaderGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr; /* Main description/title on left, stats on right */
  gap: 30px;
  margin-top: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr; /* Stack on smaller screens */
  }
`;

export const PromotionMainInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const InfoBlock = styled.div`
  background-color: ${Colors.lightBackground};
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  /* align-items: center; */
  text-align: left; /* Default text alignment for info blocks */

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

  /* Specific styles for Description block */
  &.description-block {
    min-height: 120px;
    align-items: flex-start;
    h3 {
      text-align: left;
    }
  }

  /* Specific styles for date blocks */
  &.date-block {
    p {
      color: ${Colors.primaryBlue};
    }
  }

  /* Specific styles for code/usage blocks */
  &.code-usage-block {
    p {
      font-size: 1.2rem;
      font-weight: 700;
      color: ${Colors.darkText};
      text-align: center;
    }
    h3 {
      text-align: center;
    }
  }
`;

export const PromotionMetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  /* Grid for Code and Usage */
  .top-meta-grid {
    display: grid;
    grid-template-columns: 1fr; /* Stacks Code and Usage on mobile */
    gap: 15px;

    @media (min-width: 900px) {
      /* On larger screens, use 1fr for these */
      grid-template-columns: 1fr;
    }
  }
`;

export const PromotionDates = styled.div`
  display: flex;
  gap: 15px; /* Space between start and end date blocks */

  ${InfoBlock} {
    flex: 1; /* Make date blocks share space */
    text-align: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    flex-direction: column; /* Stack dates on small mobile */
  }
`;

export const ClientTypesInvolvedBlock = styled(InfoBlock)`
  /* Inherits styles from InfoBlock */
  flex-grow: 1; /* Takes remaining space in column */
  h3 {
    text-align: left;
    margin-bottom: 10px;
  }
`;

export const ClientTypeTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

export const ClientTypeTag = styled.span`
  background-color: ${Colors.accentGreen};
  color: ${Colors.white};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${Colors.mediumGray};
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }
`;

export const ProductsSection = styled.div`
  background-color: ${Colors.lightBackground};
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  h2 {
    font-size: 1.8rem;
    color: ${Colors.darkSectionTitle};
    font-weight: 700;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${Colors.separatorSubtle};
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

export const ProductListContainer = styled.div`
  /* This will wrap your ProductList component or similar */
  min-height: 200px; /* Ensure space even if empty */
  border: 1px dashed ${Colors.lightBorder};
  border-radius: 8px;
  padding: 15px;
  background-color: ${Colors.offWhite};
  flex-grow: 1;
  overflow-y: auto; /* Enable scroll if many products */
  max-height: 400px; /* Limit height and allow scroll */

  @media (max-width: 768px) {
    max-height: 300px;
  }
`;

export const AddProductButton = styled.button`
  background-color: ${Colors.primaryBlue};
  color: ${Colors.white};
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  align-self: flex-end; /* Align to the right/end */
  margin-top: 15px;

  &:hover {
    background-color: ${Colors.darkBlue};
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%; /* Full width on mobile */
    align-self: center; /* Center on mobile */
    margin-top: 20px;
  }
`;

export const PlaceholderText = styled.p`
  text-align: center;
  color: ${Colors.mediumGray};
  font-style: italic;
  padding: 20px;
`;
