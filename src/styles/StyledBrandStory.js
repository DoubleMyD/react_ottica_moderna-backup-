// src/styles/StyledBrandStory.js
import styled, { css } from "styled-components";
import { Colors } from "./colors"; // Import your color palette

export const BrandStoryContainer = styled.div`
  background-color: ${Colors.lightBackground};
  padding: 40px 20px;
  margin: 40px auto;
  max-width: 1200px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  font-family: "Inter", sans-serif;
  color: ${Colors.darkText};
  display: flex;
  flex-direction: column;
  gap: 60px; /* Space between sections */

  @media (max-width: 768px) {
    padding: 20px 15px;
    margin: 20px auto;
    gap: 40px;
  }
`;

export const BrandStoryTitle = styled.h1`
  text-align: center;
  font-size: 3.5rem;
  color: ${Colors.darkSectionTitle};
  margin-bottom: 40px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

export const SectionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 40px; /* Space between image and text */
  padding: 20px;
  border-radius: 10px;
  background-color: ${Colors.background};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);

  @media (max-width: 992px) {
    flex-direction: column;
    text-align: center;
    gap: 30px;
    padding: 15px;
  }

  ${(props) =>
    !props.imageLeft && // If imageLeft is false, put image on right
    css`
      flex-direction: row-reverse; /* Swap order for image on right */

      @media (max-width: 992px) {
        flex-direction: column; /* Revert to column on smaller screens */
      }
    `}
`;

export const SectionImage = styled.img`
  flex-shrink: 0; /* Prevent image from shrinking */
  width: 400px; /* Fixed width for the image */
  height: 300px; /* Fixed height for the image */
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 992px) {
    width: 100%; /* Full width on smaller screens */
    max-width: 500px; /* Max width for consistency */
    height: 250px; /* Adjust height for smaller screens */
  }

  @media (max-width: 480px) {
    height: 200px;
  }
`;

export const SectionContent = styled.div`
  flex-grow: 1; /* Allow content to take remaining space */
  padding: 10px 0; /* Add some vertical padding */
`;

export const SectionTitle = styled.h2`
  font-size: 2.2rem;
  color: ${Colors.darkSectionTitle};
  margin-bottom: 15px;
  font-weight: 600;

  @media (max-width: 992px) {
    font-size: 1.8rem;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const SectionDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${Colors.darkText};

  @media (max-width: 992px) {
    font-size: 1rem;
    text-align: center;
  }
`;
