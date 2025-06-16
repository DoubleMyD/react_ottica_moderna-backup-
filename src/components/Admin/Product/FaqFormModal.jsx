// src/components/Admin/Product/FaqFormModal.jsx
import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  CloseButton,
  ModalForm,
  FormGroup,
  ModalActions,
  SubmitButton,
  CancelButton,
  ErrorMessage,
} from "../../../styles/Modals/StyledProductFormModal"; // Reusing existing modal styles

import { SectionTitle } from "../../../styles/Modals/StyledCreateCampaignModal"; // Reusing SectionTitle
import styled from "styled-components"; // Importing styled-components for new FAQ specific styles

import { STRAPI_BASE_API_URL } from "../../../data/api";
import { useAuth } from "../../../hooks/authContext";
import useProductFAQs from "../../../hooks/useProductFAQs"; // Import the custom hook

// --- New Styled Components for FAQ Modal ---
const FaqListContainer = styled.div`
  margin-top: 20px;
  max-height: 250px; /* Scrollable area for FAQs */
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  background-color: #fdfdfd;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const FaqItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 15px;
  margin-bottom: 8px;
  background-color: #ffffff;
  border: 1px solid #eee;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: #333;
    margin-bottom: 5px;
    font-size: 1.05em;
  }

  p {
    color: #555;
    font-size: 0.95em;
    line-height: 1.4;
    margin-bottom: 10px;
  }
`;

const FaqActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 8px;

  button {
    padding: 6px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.85em;
    transition: background-color 0.2s ease, transform 0.1s ease;

    &:hover {
      transform: translateY(-1px);
    }
  }
`;

const EditButton = styled.button`
  background-color: #007bff;
  color: white;
  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  &:hover {
    background-color: #c82333;
  }
`;

const AddNewFaqButton = styled(SubmitButton)`
  margin-top: 15px;
  margin-bottom: 20px;
  background-color: #28a745; /* Green color */
  &:hover {
    background-color: #218838;
  }
`;

const FaqForm = styled(ModalForm)`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

// Placeholder for a custom confirmation dialog
// In a real application, you would replace this with a proper modal component
const customConfirm = (message) => {
  return window.confirm(message); // Using window.confirm for immediate functionality, but replace in prod
};

// Placeholder for a custom alert dialog
const customAlert = (message) => {
  window.alert(message); // Using window.alert for immediate functionality, but replace in prod
};
// --- End New Styled Components ---

const FaqFormModal = ({ isOpen, onClose, productId, onSuccess }) => {
  const { authToken } = useAuth();
  // Use the custom hook to manage product FAQs
  const {
    faqs,
    loading: faqsLoading,
    error: faqsError,
    refetchFAQs,
  } = useProductFAQs(productId);

  const [formData, setFormData] = useState({
    domanda: "",
    risposta: "",
  });
  const [currentFaqToEditId, setCurrentFaqToEditId] = useState(null); // Stores Strapi ID of FAQ being edited
  const [currentFaqToEditDocumentId, setCurrentFaqToEditDocumentId] = useState(null);
  const [localLoading, setLocalLoading] = useState(false); // For form submission loading
  const [localError, setLocalError] = useState(null); // For form submission errors

  // Effect to clear form and reset edit mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalError(null); // Clear any previous local errors
      setFormData({ domanda: "", risposta: "" }); // Clear form
      setCurrentFaqToEditId(null); // Clear edit mode
      setCurrentFaqToEditDocumentId(null);
    } else {
      // Reset state when modal closes
      setFormData({ domanda: "", risposta: "" });
      setCurrentFaqToEditId(null);
      setCurrentFaqToEditDocumentId(null);
      setLocalError(null);
    }
  }, [isOpen]);

  // Effect to populate form when an FAQ is selected for editing
  useEffect(() => {
    if (currentFaqToEditId) {
      const faq = faqs.find((f) => f.id === currentFaqToEditId);
      if (faq) {
        setFormData({
          domanda: faq.domanda || "",
          risposta: faq.risposta || "",
        });
      }
    } else {
      setFormData({ domanda: "", risposta: "" }); // Clear form if not editing
    }
  }, [currentFaqToEditId, faqs]); // Depend on faqs from the hook

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = (faqId, faqDocumentId) => {
    setCurrentFaqToEditId(faqId);
    setCurrentFaqToEditDocumentId(faqDocumentId);
    setLocalError(null); // Clear any previous errors
  };

  const handleNewFaqClick = () => {
    setCurrentFaqToEditId(null);
    setCurrentFaqToEditDocumentId(null);
    setFormData({ domanda: "", risposta: "" });
    setLocalError(null); // Clear any previous errors
  };

  const handleDelete = async (faqId, faqDocumentId) => {
    if (!customConfirm("Sei sicuro di voler eliminare questa FAQ?")) {
      return;
    }

    setCurrentFaqToEditDocumentId(faqDocumentId);
    setLocalLoading(true);
    setLocalError(null);
    try {
      const response = await fetch(
        `${STRAPI_BASE_API_URL}/faqs/${faqDocumentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Errore durante l'eliminazione della FAQ."
        );
      }

      customAlert("FAQ eliminata con successo!");
      refetchFAQs(); // Re-fetch FAQs using the hook's function
      // If the deleted FAQ was the one being edited, reset the form
      if (currentFaqToEditId === faqId) {
        handleNewFaqClick();
      }
      onSuccess(); // Notify parent of success
    } catch (err) {
      console.error("Errore eliminazione FAQ:", err);
      setLocalError(err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setLocalError(null);

    if (!authToken) {
      setLocalError("Autenticazione necessaria.");
      setLocalLoading(false);
      return;
    }

    if (!formData.domanda.trim() || !formData.risposta.trim()) {
      setLocalError("Domanda e risposta sono campi obbligatori.");
      setLocalLoading(false);
      return;
    }

    const method = currentFaqToEditId ? "PUT" : "POST";
    const url = currentFaqToEditId
      ? `${STRAPI_BASE_API_URL}/faqs/${currentFaqToEditDocumentId}`
      : `${STRAPI_BASE_API_URL}/faqs`;

    try {
        const now = new Date();
        // Format the date to ISO 8601 string, which Strapi typically expects for datetime fields
        const formattedDate = now.toISOString();

      const faqPayload = {
        data: {
          domanda: formData.domanda.trim(),
          risposta: formData.risposta.trim(),
          prodotto: productId, // Link to the current product
          data: formattedDate,
          // The 'users_permissions_users' relation is usually handled by Strapi's permissions
          // if the authenticated user is automatically associated, or it would be included here
          // if it requires manual assignment (e.g., users_permissions_users: currentUserId)
        },
      };

      const apiResponse = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(faqPayload),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(
          errorData.error?.message ||
            `Errore durante ${
              currentFaqToEditId ? "l'aggiornamento" : "la creazione"
            } della FAQ.`
        );
      }

      customAlert(
        `FAQ ${currentFaqToEditId ? "aggiornata" : "creata"} con successo!`
      );
      handleNewFaqClick(); // Reset form after successful submission
      refetchFAQs(); // Re-fetch FAQs using the hook's function
      onSuccess(); // Notify parent of success
    } catch (err) {
      console.error("Errore operazione FAQ:", err);
      setLocalError(err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  // Combine local loading/error with hook's loading/error
  const isLoading = localLoading || faqsLoading;
  const displayError = localError || faqsError;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Gestisci FAQ Prodotto</h2>
          <CloseButton onClick={onClose} disabled={isLoading}>
            &times;
          </CloseButton>
        </ModalHeader>
        {displayError && <ErrorMessage>{displayError}</ErrorMessage>}

        <SectionTitle>FAQ Esistenti</SectionTitle>
        {isLoading && faqs.length === 0 ? (
          <p>Caricamento FAQ...</p>
        ) : faqs.length === 0 ? (
          <p>Nessuna FAQ associata a questo prodotto.</p>
        ) : (
          <FaqListContainer>
            {faqs.map((faq) => (
              <FaqItem key={faq.id}>
                <strong>Domanda:</strong> <p>{faq.domanda}</p>
                <strong>Risposta:</strong> <p>{faq.risposta}</p>
                <FaqActions>
                  <EditButton
                    type="button"
                    onClick={() => handleEditClick(faq.id, faq.documentId)}
                    disabled={isLoading}
                  >
                    Modifica
                  </EditButton>
                  <DeleteButton
                    type="button"
                    onClick={() => handleDelete(faq.id, faq.documentId)}
                    disabled={isLoading}
                  >
                    Elimina
                  </DeleteButton>
                </FaqActions>
              </FaqItem>
            ))}
          </FaqListContainer>
        )}

        <AddNewFaqButton
          type="button"
          onClick={handleNewFaqClick}
          disabled={isLoading}
        >
          {currentFaqToEditId
            ? "Annulla Modifica / Aggiungi Nuova FAQ"
            : "Aggiungi Nuova FAQ"}
        </AddNewFaqButton>

        <SectionTitle>
          {currentFaqToEditId ? "Modifica FAQ" : "Aggiungi Nuova FAQ"}
        </SectionTitle>
        <FaqForm onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="domanda">Domanda:</label>
            <input
              type="text"
              id="domanda"
              name="domanda"
              value={formData.domanda}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="risposta">Risposta:</label>
            <textarea
              id="risposta"
              name="risposta"
              value={formData.risposta}
              onChange={handleChange}
              rows="4"
              required
              disabled={isLoading}
            ></textarea>
          </FormGroup>

          <ModalActions>
            <CancelButton type="button" onClick={onClose} disabled={isLoading}>
              Chiudi
            </CancelButton>
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading
                ? "Processo..."
                : currentFaqToEditId
                ? "Aggiorna FAQ"
                : "Crea FAQ"}
            </SubmitButton>
          </ModalActions>
        </FaqForm>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FaqFormModal;
