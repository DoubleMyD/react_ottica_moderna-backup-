// src/styles/Modals/StyledConfirmationModal.js
import styled from "styled-components";
import { Colors } from "../colors"; // Ensure path is correct

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent black overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* Higher z-index to ensure it's on top of everything */
  backdrop-filter: blur(5px); /* Optional: blur background */
`;

export const ModalContent = styled.div`
  background-color: ${Colors.background};
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  width: 90%;
  max-width: 500px; /* Max width for confirmation modal */
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  font-family: "Inter", sans-serif;
  color: ${Colors.darkText};
  text-align: center; /* Center content by default */

  @media (max-width: 768px) {
    padding: 20px;
    width: 95%;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: center; /* Center header title */
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${Colors.separatorSubtle};
  position: relative; /* For close button absolute positioning */

  h2 {
    font-size: 1.8rem;
    color: ${Colors.darkSectionTitle};
    font-weight: 700;
    margin: 0;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: ${Colors.mediumGray};
  cursor: pointer;
  position: absolute; /* Position close button top right */
  top: 0;
  right: 0;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: ${Colors.accentRed};
  }
`;

export const ModalMessage = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: ${Colors.darkText};
  margin-bottom: 20px;
  text-align: left; /* Align message text to left */
`;

export const MessageHighlight = styled.span`
  font-weight: bold;
  color: ${Colors.primaryBlue};
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: center; /* Center action buttons */
  gap: 15px;
  margin-top: 20px;

  button {
    padding: 12px 25px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease, opacity 0.2s ease, transform 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    }
  }
`;

export const ConfirmButton = styled.button`
  background-color: ${Colors.accentGreen};
  color: ${Colors.white};

  &:hover:not(:disabled) {
    background-color: #218838; /* Darker green */
  }
`;

export const CancelButton = styled.button`
  background-color: ${Colors.lightGray};
  color: ${Colors.darkText};

  &:hover:not(:disabled) {
    background-color: ${Colors.mediumGray};
    color: ${Colors.white};
  }
`;

export const ErrorMessage = styled.p`
  color: ${Colors.accentRed};
  font-size: 0.9rem;
  text-align: center;
  margin-top: -10px;
  margin-bottom: 10px;
`;