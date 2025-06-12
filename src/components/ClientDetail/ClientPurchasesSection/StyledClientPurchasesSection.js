// src/styles/StyledClientPurchasesSection.js
import styled from "styled-components";
import { Colors } from "../../../styles/colors";

export const SectionCard = styled.div`
  background-color: ${Colors.white};
  border: 1px solid ${Colors.lightBorder};
  border-radius: 12px; /* Consistent rounded corners */
  padding: 25px; /* Consistent padding */
  margin-bottom: 25px; /* Consistent margin */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); /* Subtle shadow for depth */
  overflow: hidden;
`;

export const SectionTitle = styled.h2`
  font-size: 1.8rem; /* Larger title */
  color: ${Colors.darkSectionTitle};
  margin-bottom: 20px; /* Space below title */
  font-weight: 700; /* Bolder title */
  text-align: center; /* Center the title */
  padding-bottom: 10px;
  border-bottom: 1px solid ${Colors.lightBorder}; /* Underline for emphasis */
`;

export const SectionContent = styled.div`
  /* Basic container for the purchase history list, adjust as needed */
  padding-top: 20px; /* Space above the history list */
`;

export const MostPurchasedProductBlock = styled.div`
  background-color: ${Colors.tertiaryBackground}; /* A distinct background color */
  border: 1px solid ${Colors.mediumBorder}; /* Slightly stronger border */
  border-radius: 10px; /* Rounded corners */
  padding: 20px; /* Good internal padding */
  margin: 20px auto; /* Center the block and provide vertical margin */
  display: flex;
  flex-direction: column;
  gap: 12px; /* Space between elements */
  align-items: center; /* Center content horizontally */
  text-align: center; /* Center text */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); /* Soft shadow */
  max-width: 400px; /* Limit width for a cleaner look */
  transition: all 0.2s ease-in-out; /* Smooth transition */

  &:hover {
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1); /* Slightly larger shadow on hover */
    transform: translateY(-2px); /* Slight lift */
    cursor: pointer
  }

  h3 {
    font-size: 1.25rem; /* Larger font for the heading */
    color: ${Colors.darkSectionTitle};
    font-weight: 600;
    margin-bottom: 5px; /* Space below heading */
  }

  h3 span {
    /* Style for the clickable product name */
    color: ${Colors.primaryBlue};
    cursor: pointer;
    text-decoration: none; /* No underline by default */
    font-weight: 700;
    transition: text-decoration 0.2s ease;

    &:hover {
      text-decoration: underline; /* Underline on hover for clickability */
    }
  }

  p {
    font-size: 1rem;
    color: ${Colors.darkText};
    margin-bottom: 5px; /* Space below paragraphs */
  }

  p span {
    /* Style for the total spent value */
    font-weight: bold;
    color: ${Colors.accentGreen}; /* A positive accent color for money spent */
  }

  img {
    max-width: 150px; /* Increased size as per previous request */
    max-height: 150px; /* Increased size */
    object-fit: contain; /* Ensures the whole image is visible */
    border-radius: 8px; /* Slightly more rounded image corners */
    margin-top: 10px; /* Space above the image */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for the image */
  }

  @media (max-width: 768px) {
    padding: 15px;
    gap: 10px;
    h3 {
      font-size: 1.1rem;
    }
    p {
      font-size: 0.9rem;
    }
    img {
      max-width: 120px;
      max-height: 120px;
    }
  }
`;

export const PlaceholderText = styled.p`
  color: ${Colors.greyText};
  font-style: italic;
  text-align: center;
  padding: 20px;
`;
