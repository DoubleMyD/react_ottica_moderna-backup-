// src/styles/ShopShowcaseStyledComponents.js
import styled from "styled-components";
import { Colors } from "../../styles/colors"; // Import your color palette

export const ShowcaseContainer = styled.div`
  display: flex;
  flex-direction: row; /* Default to row on larger screens */
  align-items: center; /* Vertically align items in the center */
  justify-content: center;
  padding: 80px 40px; /* Ample padding around the section */
  max-width: 1200px; /* Max width to contain content */
  margin: 40px auto; /* Center the container on the page */
  background-color: #ffffff; /* Or a light background color from your palette */
  border-radius: 8px; /* Slightly rounded corners for the section */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); /* Subtle shadow */

  @media (max-width: 992px) {
    flex-direction: column; /* Stack vertically on medium screens */
    padding: 60px 30px;
  }

  @media (max-width: 768px) {
    padding: 40px 20px;
    margin: 20px auto;
  }
`;

export const ImageWrapper = styled.div`
  flex: 1; /* Takes equal space */
  max-width: 50%; /* Max width for the image container */
  margin-right: 40px; /* Space between image and text */
  text-align: center; /* Center image inside its wrapper if it's smaller */

  img {
    max-width: 100%; /* Ensure image is responsive */
    height: auto;
    border-radius: 8px; /* Match container border-radius */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Shadow for the image */
  }

  @media (max-width: 992px) {
    max-width: 80%; /* Larger on stacked layout */
    margin-right: 0; /* No right margin when stacked */
    margin-bottom: 40px; /* Space below image when stacked */
  }

  @media (max-width: 768px) {
    max-width: 100%;
    margin-bottom: 30px;
  }
`;

export const ContentWrapper = styled.div`
  flex: 1; /* Takes equal space */
  max-width: 50%; /* Max width for the content container */
  text-align: left; /* Text aligns left */

  @media (max-width: 992px) {
    max-width: 90%; /* Adjust width on stacked layout */
    text-align: center; /* Center text when stacked */
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const ShowcaseTitle = styled.h2`
  font-size: 3rem;
  color: ${Colors.darkSectionTitle}; /* Reusing your color */
  margin-bottom: 20px;
  line-height: 1.2;

  @media (max-width: 992px) {
    font-size: 2.5rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 15px;
  }
`;

export const ShowcaseDescription = styled.p`
  font-size: 1.15rem;
  color: ${Colors.darkGray}; /* Reusing your color */
  line-height: 1.6;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 25px;
  }
`;
