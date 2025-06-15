// src/components/Admin/Marketing/DeletePromotionButton.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Colors } from '../../../styles/colors';
import ConfirmationModal from '../../Modals/ConfirmationModal'; // Generic confirmation modal
import useDeletePromotion from '../../../hooks/useDeletePromotion'; // New hook

const StyledAdminActionButton = styled.button`
  background-color: ${Colors.accentRed};
  color: ${Colors.white};
  border: none;
  border-radius: 8px;
  padding: 10px 15px; /* Adjust padding for better button look */
  font-size: 1rem; /* Adjust font size */
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  display: flex; /* For icon and text alignment */
  align-items: center;
  gap: 5px; /* Space between icon and text if present */
  min-width: 40px; /* Minimum width for icon-only button */
  justify-content: center; /* Center content */

  &:hover {
    background-color: #c82333;
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

const DeletePromotionButton = ({ promotion, onDeleteSuccess, disabled = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deletePromotion, loading, error } = useDeletePromotion();

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    const success = await deletePromotion(promotion.id, promotion.documentId);
    if (success) {
      setIsModalOpen(false); // Close modal
      alert("Campagna eliminata con successo!");
      if (onDeleteSuccess) {
        onDeleteSuccess(); // Notify parent
      }
    }
    // Error is handled by the hook and displayed in the modal
  };

  return (
    <>
      <StyledAdminActionButton onClick={handleDeleteClick} disabled={disabled || loading} title="Elimina Campagna">
        🗑️ {loading && "Eliminazione..."} {/* Show loading text only when deleting */}
      </StyledAdminActionButton>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Conferma Eliminazione Campagna"
        message={
          <>
            Sei sicuro di voler eliminare la campagna "<strong>{promotion.titolo}</strong>"?<br />
            Questa azione è irreversibile e verranno eliminati anche tutti i dettagli prodotto associati.
          </>
        }
        confirmText="Elimina Definitivamente"
        cancelText="Annulla"
        loading={loading}
        error={error}
      />
    </>
  );
};

export default DeletePromotionButton;