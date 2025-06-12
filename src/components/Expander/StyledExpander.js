// src/components/Expander/StyledExpander.js
import styled from "styled-components";
import { Colors } from "../../styles/colors"; // Corrected path to common colors

export const ExpanderContainer = styled.div`
  margin-bottom: 15px;
  width: 100%;
`;

export const ExpanderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  cursor: pointer;
  background-color: ${Colors.primaryBlue}; /* Using Colors from common styles */
  color: ${Colors.lightText};
  font-weight: bold;
  padding: 15px 20px;
  border-radius: 8px; /* Added for better appearance */
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${Colors.darkBlue};
  }
`;

export const ExpanderLabel = styled.span`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: inherit; /* Inherit color from ExpanderHeader */
  font-weight: bold;
`;

export const ExpanderArrow = styled.span`
  font-size: 16px;
  color: inherit; /* Inherit color from ExpanderHeader */
  transition: transform 0.2s ease-in-out;

  &.expanded {
    transform: rotate(90deg); /* Ruota la freccia quando è espansa */
  }
`;

export const ExpanderContent = styled.div`
  margin-top: 10px;
  overflow: hidden; /* Importante per l'animazione di altezza */
  background-color: ${Colors.lightBackground}; /* Using Colors from common styles */
  border: 1px solid ${Colors.lightBorder}; /* Added border */
  border-top: none; /* No top border, it connects to header */
  border-radius: 0 0 8px 8px; /* Rounded bottom corners */
  padding: ${(props) => (props.$isOpen ? "15px 20px" : "0 20px")}; /* Padded when open */
  max-height: ${(props) =>
    props.$isOpen ? "500px" : "0"}; /* Altezza massima quando aperto */
  transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out;
`;