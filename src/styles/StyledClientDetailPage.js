// src/styles/StyledClientDetailPage.js
import styled from "styled-components";
import { Colors } from "./colors";

export const ClientDetailContainer = styled.div`
  background-color: ${Colors.background};
  padding: 40px;
  margin: 40px auto;
  max-width: 1200px; /* Adjust as needed for overall page width */
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  font-family: "Inter", sans-serif;
  color: ${Colors.darkText};
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative; /* For BackArrowButton */

  @media (max-width: 1024px) {
    padding: 25px;
    margin: 20px auto;
  }
  @media (max-width: 768px) {
    padding: 15px;
    margin: 15px;
    box-shadow: none; /* Less shadow on small screens */
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

export const ClientMainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr; /* Two columns: Purchases on left, Promotions on right */
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr; /* Stack columns on smaller screens */
  }
`;

export const PlaceholderText = styled.p`
  text-align: center;
  color: ${Colors.mediumGray};
  font-style: italic;
  padding: 20px;
`;
