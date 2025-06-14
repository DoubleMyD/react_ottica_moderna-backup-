// src/components/Modals/ConfirmationModal.jsx
import React from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  CloseButton,
  ModalMessage,
  ModalActions,
  ConfirmButton,
  CancelButton,
  ErrorMessage
} from '../../styles/Modals/StyledConfirmationModal'; // Correct import path

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Conferma',
  cancelText = 'Annulla',
  loading = false,
  error = null,
  children // For more complex messages or content
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm && !loading) {
      onConfirm();
    }
  };

  return (
    <ModalOverlay onClick={onClose}> {/* Close on overlay click */}
      <ModalContent onClick={e => e.stopPropagation()}> {/* Prevent closing when clicking inside */}
        <ModalHeader>
          <h2>{title}</h2>
          <CloseButton onClick={onClose} disabled={loading}>&times;</CloseButton>
        </ModalHeader>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && <ModalMessage>{message}</ModalMessage>}
        {children} {/* Render any custom content passed as children */}
        <ModalActions>
          <CancelButton onClick={onClose} disabled={loading}>
            {cancelText}
          </CancelButton>
          <ConfirmButton onClick={handleConfirm} disabled={loading}>
            {loading ? 'Caricamento...' : confirmText}
          </ConfirmButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmationModal;