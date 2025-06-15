// src/components/ClientTypes/EditClientTypeButton.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import ClientTypeFormModal from './ClientTypeFormModal'; // New form modal for client types (now no Portal)

const StyledAdminActionButton = styled.button`
  background-color: ${Colors.lightGray};
  color: ${Colors.darkText};
  border: none;
  border-radius: 8px;
  padding: 8px 12px; /* Adjusted padding for table context */
  font-size: 0.9em; /* Smaller font for table buttons */
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 30px;
  justify-content: center;

  &:hover {
    background-color: ${Colors.mediumGray};
    color: ${Colors.white};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background-color: ${Colors.mediumGray};
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
    box-shadow: none;
  }
`;

const EditClientTypeButton = ({ clientType, onEditSuccess, disabled = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent row expansion
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false); // Close modal
    if (onEditSuccess) {
      onEditSuccess(); // Notify parent
    }
  };

  return (
    <>
      <StyledAdminActionButton onClick={handleEditClick} disabled={disabled} title="Modifica Tipologia">
        ✏️
      </StyledAdminActionButton>

      {isModalOpen && (
        <ClientTypeFormModal
        
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
          initialData={clientType} // Pass the full clientType object to pre-fill
          key={clientType.id} // Force re-render of modal on different clientType
        />
      )}
    </>
  );
};

export default EditClientTypeButton;
