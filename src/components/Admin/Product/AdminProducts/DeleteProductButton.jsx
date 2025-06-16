// src/components/Admin/Product/DeleteProductButton.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Colors } from '../../../../styles/colors';
import ConfirmationModal from '../../../Modals/ConfirmationModal'; // Generic confirmation modal
import useDeleteProduct from '../../../../hooks/useDeleteProduct'; // NEW: New hook for deleting product

const StyledAdminActionButton = styled.button`
  background-color: ${Colors.accentRed};
  color: ${Colors.white};
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 40px;
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

const DeleteProductButton = ({ product, onDeleteSuccess, disabled = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteProduct, loading, error } = useDeleteProduct();

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    // Pass Strapi ID, Document ID, and Image ID to the hook
    const success = await deleteProduct(product.id, product.documentId, product.immagine?.id);
    if (success) {
      setIsModalOpen(false); // Close modal
      alert("Prodotto eliminato con successo!");
      if (onDeleteSuccess) {
        onDeleteSuccess(); // Notify parent
      }
    }
    // Error is handled by the hook and displayed in the modal
  };

  return (
    <>
      <StyledAdminActionButton onClick={handleDeleteClick} disabled={disabled || loading} title="Elimina Prodotto">
        🗑️ {loading && "Eliminazione..."} {/* Show loading text only when deleting */}
      </StyledAdminActionButton>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Conferma Eliminazione Prodotto"
        message={
          <>
            Sei sicuro di voler eliminare il prodotto "<strong>{product.nome}</strong>"?<br />
            Questa azione è irreversibile e comporterà l'eliminazione definitiva del prodotto e della sua immagine associata.
            <br/><br/>
            <strong>Dettagli Prodotto:</strong><br/>
            ID: {product.id}<br/>
            Document ID: {product.documentId}<br/>
            Nome: {product.nome}<br/>
            Brand: {product.brand}<br/>
            Tipologia: {product.tipologia}<br/>
            Prezzo: €{product.prezzo_unitario?.toFixed(2)}<br/>
            Quantità: {product.quantita_disponibili}
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

export default DeleteProductButton;
