// src/styles/Admin/Marketing/StyledCreateCampaignModal.js
import styled from "styled-components";
import { Colors } from "../colors";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
`;

export const ModalContent = styled.div`
  background-color: ${Colors.background};
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 800px; /* Wider for more complex form */
  max-height: 90vh; /* Limit height and enable scroll */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  font-family: "Inter", sans-serif;
  color: ${Colors.darkText};

  @media (max-width: 768px) {
    padding: 20px;
    width: 95%;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid ${Colors.separatorSubtle};
  padding-bottom: 15px;

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
  transition: color 0.2s ease;

  &:hover {
    color: ${Colors.accentRed};
  }
`;

export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${Colors.darkText};
  }

  input[type="text"],
  input[type="number"],
  input[type="datetime-local"],
  textarea,
  select {
    padding: 10px 12px;
    border: 1px solid ${Colors.lightBorder};
    border-radius: 6px;
    font-size: 1rem;
    color: ${Colors.darkText};
    background-color: ${Colors.offWhite};
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus {
      border-color: ${Colors.primaryBlue};
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      outline: none;
    }
  }

  textarea {
    min-height: 80px;
    resize: vertical;
  }
`;

export const SelectTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border: 1px solid ${Colors.lightBorder};
  border-radius: 6px;
  padding: 8px;
  min-height: 40px;
  background-color: ${Colors.offWhite};
  align-items: center;

  select {
    flex-grow: 1;
    border: none;
    background-color: transparent;
    padding: 0;
    margin: 0;
    height: auto; /* Allow select to grow */
    min-width: 150px;
    cursor: pointer;

    &:focus {
      outline: none;
      box-shadow: none;
    }
  }
`;

export const SelectedTag = styled.span`
  background-color: ${Colors.primaryBlue};
  color: ${Colors.white};
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;

  button {
    background: none;
    border: none;
    color: ${Colors.white};
    font-size: 1rem;
    cursor: pointer;
    line-height: 1;
    padding: 0;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: ${Colors.darkSectionTitle};
  margin-top: 20px;
  margin-bottom: 10px;
  border-bottom: 1px solid ${Colors.separatorSubtle};
  padding-bottom: 5px;
`;

export const ProductDetailCard = styled.div`
  border: 1px solid ${Colors.lightBorder};
  border-radius: 8px;
  padding: 15px;
  background-color: ${Colors.lightBackground};
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative; /* For remove button */
`;

export const RemoveProductDetailButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${Colors.accentRed};
  color: ${Colors.white};
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #c82333;
  }
`;

export const AddProductDetailButton = styled.button`
  background-color: ${Colors.accentGreen};
  color: ${Colors.white};
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #218838;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease, opacity 0.2s ease;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

export const SubmitButton = styled.button`
  background-color: ${Colors.primaryBlue};
  color: ${Colors.white};
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);

  &:hover:not(:disabled) {
    background-color: ${Colors.darkBlue};
  }
`;

export const CancelButton = styled.button`
  background-color: ${Colors.lightGray};
  color: ${Colors.darkText};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  &:hover:not(:disabled) {
    background-color: ${Colors.mediumGray};
  }
`;

export const ErrorMessage = styled.p`
  color: ${Colors.accentRed};
  font-size: 0.9rem;
  text-align: center;
  margin-top: -10px;
  margin-bottom: 10px;
`;