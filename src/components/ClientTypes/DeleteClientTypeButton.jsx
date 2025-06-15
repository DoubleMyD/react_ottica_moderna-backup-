// src/components/ClientTypes/DeleteClientTypeButton.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import ConfirmationModal from '../Modals/ConfirmationModal'; // Generic confirmation modal (now no Portal)
import useDeleteClientType from '../../hooks/useDeleteClientType'; // New hook

const StyledAdminActionButton = styled.button`
  background-color: ${Colors.accentRed};
  color: ${Colors.white};
  border: none;
  border-radius: 8px;
  padding: 8px 12px; /* Adjusted padding for table context */
  font-size: 0.9em; /* Smaller font for table buttons */
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 30px; /* Smaller min-width for icon */
  justify-content: center;

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

const DeleteClientTypeButton = ({ clientType, onDeleteSuccess, disabled = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteClientType: performDelete, loading, error } = useDeleteClientType();

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent row expansion
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    const success = await performDelete(clientType.documentId); // Pass Strapi ID
    if (success) {
      setIsModalOpen(false);
      // alert("Tipologia cliente eliminata con successo!"); // Alert handled by parent or by this component if preferred
      if (onDeleteSuccess) {
        onDeleteSuccess(); // Notify parent of success
      }
    }
  };

  return (
    <>
      <StyledAdminActionButton onClick={handleDeleteClick} disabled={disabled || loading} title="Elimina Tipologia">
        🗑️ {loading && "Eliminazione..."}
      </StyledAdminActionButton>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Conferma Eliminazione Tipologia Cliente"
        message={
          <>
            Sei sicuro di voler eliminare la tipologia cliente "<strong>{clientType.nome}</strong>"?<br />
            Questa azione è irreversibile.
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

export default DeleteClientTypeButton;
