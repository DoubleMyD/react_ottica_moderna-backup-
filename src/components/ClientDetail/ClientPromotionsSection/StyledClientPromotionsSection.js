// src/styles/StyledClientPromotionsSection.js
import styled from "styled-components";
import { Colors } from "../../../styles/colors"; // Assuming you have this file

export const SectionCard = styled.div`
  background-color: ${Colors.white};
  border: 1px solid ${Colors.lightBorder};
  border-radius: 12px; /* Slightly more rounded corners */
  padding: 25px; /* More padding */
  margin-bottom: 25px; /* Consistent margin */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); /* Subtle shadow for depth */
  overflow: hidden; /* Ensures content stays within rounded corners */
`;

export const SectionTitle = styled.h2`
  font-size: 1.8rem; /* Larger title */
  color: ${Colors.darkSectionTitle};
  margin-bottom: 20px; /* More space below title */
  font-weight: 700; /* Bolder title */
  text-align: center; /* Center the title */
  padding-bottom: 10px;
  border-bottom: 1px solid ${Colors.lightBorder}; /* Underline for emphasis */
`;

export const SectionContent = styled.div`
  padding: 0 10px; /* Small horizontal padding to keep content slightly indented */
`;

export const PromotionList = styled.ul`
  list-style: none; /* Remove default list bullets */
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px; /* Space between list items */
`;

export const PromotionListItem = styled.li`
  background-color: ${Colors.offWhite}; /* Slightly off-white background for each item */
  border: 1px solid ${Colors.mediumBorder}; /* Defined border */
  border-radius: 8px; /* Rounded corners for items */
  padding: 15px 20px; /* Good internal padding */
  display: flex;
  align-items: flex-start; /* Align items to the start (top) */
  gap: 15px; /* Space between image (if present) and text content */
  cursor: pointer;
  transition: all 0.2s ease-in-out; /* Smooth transition for hover effects */

  &:hover {
    background-color: ${Colors.lightBlueBackground}; /* Light blue on hover */
    border-color: ${Colors.primaryBlue}; /* Blue border on hover */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* More pronounced shadow on hover */
    transform: translateY(-2px); /* Slight lift effect */
  }

  img {
    width: 80px; /* Fixed width for images */
    height: 80px; /* Fixed height for images */
    object-fit: cover; /* Crop image to fit */
    border-radius: 4px; /* Small border-radius for image */
    flex-shrink: 0; /* Prevent image from shrinking */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  & > div {
    /* This targets the main content div next to the image */
    flex-grow: 1; /* Allows the content div to take available space */
  }

  strong {
    font-size: 1.2rem; /* Larger title for promotion */
    color: ${Colors.primaryBlue}; /* Primary color for title */
    display: block; /* Make it a block element for spacing */
    margin-bottom: 5px;
  }

  p {
    font-size: 0.95rem;
    color: ${Colors.darkText};
    line-height: 1.4;
    margin-bottom: 10px;
  }

  .date-info {
    font-size: 0.85rem;
    color: ${Colors.greyText};
    margin-top: 5px;
    margin-bottom: 10px;
    font-style: italic;
  }

  .dettaglio-promozioni-list {
    /* New class for the wrapper of dettaglio_promozionis */
    margin-top: 10px;
    border-top: 1px dashed ${Colors.lightBorder}; /* Separator line */
    padding-top: 10px;
  }

  .dettaglio-promo-item {
    /* Style for each individual dettaglio_promozione */
    font-size: 0.8em; /* Smaller text for detail */
    color: ${Colors.accentRed}; /* Differentiate with an accent color */
    margin-bottom: 3px;
    background-color: ${Colors.lightGreyBackground}; /* Subtle background */
    padding: 3px 6px;
    border-radius: 4px;
    display: inline-block; /* Allows items to flow horizontally if space allows */
    margin-right: 8px; /* Space between multiple detail items */
    white-space: nowrap; /* Prevents breaking values */
  }

  @media (max-width: 768px) {
    flex-direction: column; /* Stack items vertically on smaller screens */
    align-items: center;
    text-align: center;

    img {
      margin-bottom: 10px;
    }

    & > div {
      text-align: center;
    }

    .dettaglio-promo-item {
      margin-right: 0;
      margin-bottom: 5px;
    }
  }
`;

export const PlaceholderText = styled.p`
  color: ${Colors.greyText};
  font-style: italic;
  text-align: center;
  padding: 20px;
`;
