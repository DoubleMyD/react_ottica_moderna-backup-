// src/components/Admin/Marketing/EditPromotionButton.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Colors } from '../../../styles/colors';
import CampaignFormModal from './CampaignFormModal'; // Reuse CampaignFormModal

const StyledAdminActionButton = styled.button`
  background-color: ${Colors.lightGray};
  color: ${Colors.darkText};
  border: none;
  border-radius: 8px;
  padding: 10px 15px; /* Adjust padding for better button look */
  font-size: 1rem; /* Adjust font size */
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 40px;
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

const EditPromotionButton = ({ promotion, onEditSuccess, disabled = false, showText = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = () => {
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
      <StyledAdminActionButton onClick={handleEditClick} disabled={disabled} title="Modifica Campagna">
        ✏️ {showText && "Modifica"}
      </StyledAdminActionButton>

      {isModalOpen && (
        <CampaignFormModal
          isOpen={isModalOpen}
          
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
          initialData={promotion} // Pass the full promotion object for pre-filling
          key={promotion.id} // Important: Force re-render of modal when editing a new promotion
        />
      )}
    </>
  );
};

export default EditPromotionButton;