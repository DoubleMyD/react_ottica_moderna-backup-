// src/styles/StyledGeneralFAQPage.js
import styled from "styled-components";
import { Colors } from "./colors"; // Import your color palette

export const GeneralFAQPageContainer = styled.div`
  background-color: ${Colors.lightBackground};
  padding: 40px 20px;
  margin: 40px auto;
  max-width: 900px; /* A good width for a content-heavy page like FAQ */
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  font-family: "Inter", sans-serif;
  color: ${Colors.darkText};
  display: flex;
  flex-direction: column;
  gap: 30px;

  @media (max-width: 768px) {
    padding: 20px 15px;
    margin: 20px auto;
  }
`;

export const GeneralFAQTitle = styled.h1`
  text-align: center;
  font-size: 3rem;
  color: ${Colors.darkSectionTitle};
  margin-bottom: 30px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 20px;
  }
`;

export const NoFAQsMessage = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: ${Colors.mediumGray};
  padding: 20px;
`;
