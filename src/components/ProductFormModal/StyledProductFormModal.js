// src/styles/Admin/Product/StyledCreateProductModal.js
import styled from "styled-components";
import { Colors } from "../../styles/colors";

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
  z-index: 1000; /* Ensure it's above everything else */
  backdrop-filter: blur(5px); /* Optional: blur background */
`;

export const ModalContent = styled.div`
  background-color: ${Colors.background};
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 600px; /* Max width for larger screens */
  max-height: 90vh; /* Limit height and enable scroll */
  overflow-y: auto; /* Enable scrolling for content if needed */
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative; /* For close button positioning */
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
  textarea {
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

export const FileInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${Colors.darkText};
  }

  input[type="file"] {
    display: none; /* Hide default file input */
  }

  .custom-file-input {
    display: inline-block;
    background-color: ${Colors.secondaryBlue};
    color: ${Colors.white};
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    &:hover {
      background-color: ${Colors.darkBlue};
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    }
  }

  .file-name {
    margin-top: 5px;
    font-size: 0.85rem;
    color: ${Colors.mediumGray};
  }

  img {
    max-width: 150px;
    max-height: 150px;
    object-fit: contain;
    border-radius: 8px;
    margin-top: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end; /* Align buttons to the right */
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
