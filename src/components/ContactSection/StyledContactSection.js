// src/styles/ShopContactStyledComponents.js
import styled from "styled-components";

export const ShopContactContainer = styled.div`
  background-color: #f8f9fa; /* Light background for the section */
  padding: 50px 20px; /* Ample padding top/bottom and sides */
  margin-top: 60px; /* Space above this section from content above */
  border-top: 1px solid #e9ecef; /* Subtle separator from previous content */
  text-align: center; /* Center the title if it's there */
  font-family: "Arial", sans-serif;
  color: #343a40; /* Darker text color */

  @media (max-width: 768px) {
    padding: 40px 15px;
  }
`;

export const ShopContactContentWrapper = styled.div`
  display: flex;
  justify-content: center; /* Center content horizontally */
  align-items: flex-start; /* Align items to the top (useful if other side has taller content) */
  max-width: 960px; /* Max width for content to prevent it from stretching too wide */
  margin: 0 auto; /* Center the wrapper itself */
  gap: 50px; /* Space between left and right sections */

  @media (max-width: 768px) {
    flex-direction: column; /* Stack vertically on smaller screens */
    align-items: center; /* Center items when stacked */
    gap: 30px;
  }
`;

export const ContactInfoSection = styled.div`
  flex: 1; /* Allow this section to grow */
  text-align: left; /* Text aligns left within this section */
  max-width: 400px; /* Limit width of contact info block */
  min-width: 280px; /* Ensure it doesn't shrink too much */

  @media (max-width: 768px) {
    text-align: center; /* Center text when stacked on small screens */
    max-width: 100%;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 25px;
  text-align: center; /* Center the title itself */

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
`;

export const ContactLine = styled.p`
  font-size: 1.1rem;
  margin-bottom: 10px; /* Space between each line */
  display: flex; /* Use flex to align icon and text */
  align-items: center;
  color: #495057;

  &:last-child {
    margin-bottom: 0; /* No margin after the last line */
  }

  svg {
    margin-right: 10px; /* Space between icon and text */
    color: #007bff; /* Icon color */
    min-width: 20px; /* Ensure icon has space */
  }

  a {
    color: #007bff; /* Link color */
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    justify-content: center; /* Center lines when stacked */
  }
`;

export const MapContainer = styled.div`
  flex: 1; /* Allow map container to grow */
  max-width: 500px; /* Max width for the map */
  height: 300px; /* Fixed height for the map */
  border-radius: 8px;
  overflow: hidden; /* Ensure map corners are rounded */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */

  iframe {
    width: 100%;
    height: 100%;
    border: 0; /* Remove default iframe border */
  }

  @media (max-width: 768px) {
    max-width: 100%; /* Full width on small screens */
    height: 250px; /* Slightly smaller height on mobile */
  }
`;
