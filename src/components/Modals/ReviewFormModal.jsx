// src/components/Reviews/ReviewFormModal.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
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
} from "../../styles/Modals/StyledProductFormModal"; // Reusing some base modal styles

import { STRAPI_BASE_API_URL } from "../../data/api";
import { useAuth } from "../../hooks/authContext";
import useUserAndClienteData from "../../hooks/useUserAndClienteData";

// Styled components specific to ReviewFormModal
const StarRatingContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 5px;

  input[type="radio"] {
    display: none; // Hide default radio button
  }

  label {
    cursor: pointer;
    font-size: 2em; // Larger stars
    color: #ccc; // Default star color
    transition: color 0.2s;
    padding: 0 5px; // Spacing between stars

    &:hover,
    &:hover ~ label {
      color: #ffc107; // Gold on hover
    }
  }

  // Filled stars based on selected radio button (using :checked ~ label for previous siblings)
  input[type="radio"]:checked ~ label {
    color: #ffc107;
  }
`;

const ReviewFormModal = ({ isOpen, onClose, productId, onSuccess }) => {
  const { authToken } = useAuth(); // Assuming 'user' object from useAuth contains user ID
  const { clienteData } = useUserAndClienteData();

  const [formData, setFormData] = useState({
    stelle: 0, // Star rating (1-5)
    titolo: "",
    descrizione: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset form when modal opens or productId changes (for new review)
    if (isOpen) {
      setFormData({
        stelle: 0,
        titolo: "",
        descrizione: "",
      });
      setError(null);
    }
  }, [isOpen, productId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value, 10) : value,
    }));
  };

  const handleStarChange = (value) => {
    {
      console.log(value);
    }    
    setFormData((prev) => ({
      ...prev,
      stelle: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!authToken || !clienteData?.id) {
      // Ensure user is authenticated and user ID is available
      setError("Autenticazione necessaria per inviare una recensione.");
      setLoading(false);
      return;
    }

    // Basic validation
    if (formData.stelle === 0) {
      setError("Seleziona un numero di stelle (da 1 a 5).");
      setLoading(false);
      return;
    }
    if (!formData.titolo.trim() || !formData.descrizione.trim()) {
      setError("Titolo e descrizione sono campi obbligatori.");
      setLoading(false);
      return;
    }

    try {
      const now = new Date();
      const formattedDate = now.toISOString(); // ISO 8601 string for Strapi datetime field

      const reviewPayload = {
        data: {
          stelle: formData.stelle,
          titolo: formData.titolo.trim(),
          descrizione: formData.descrizione.trim(),
          data: formattedDate,
          cliente: clienteData.id, // Link to the authenticated user's client ID
          // Conditionally add prodotto relation
          ...(productId && { prodotto: productId }),
        },
      };

      const apiResponse = await fetch(`${STRAPI_BASE_API_URL}/recensiones`, {
        method: "POST", // Always POST for new reviews
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(reviewPayload),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(
          errorData.error?.message || "Errore durante l'invio della recensione."
        );
      }

      const responseData = await apiResponse.json();
      console.log("Recensione inviata con successo:", responseData);
      window.alert("Recensione inviata con successo!"); // Use custom alert in production

      onSuccess(); // Notify parent component (ReviewsPage) of success
      onClose(); // Close the modal
    } catch (err) {
      console.error("Errore invio recensione:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = productId
    ? "Scrivi una recensione per questo prodotto"
    : "Scrivi una recensione generale";

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>{modalTitle}</h2>
          <CloseButton onClick={onClose} disabled={loading}>
            &times;
          </CloseButton>
        </ModalHeader>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ModalForm onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="stelle">Valutazione (Stelle):</label>
            <StarRatingContainer>
              {[1,2,3,4,5].map((star) => (
                <React.Fragment key={star}>
                  <input
                    type="radio"
                    id={`star-${star}`}
                    name="stelle"
                    value={star}
                    checked={formData.stelle === star}
                    onChange={() => handleStarChange(star)}
                    disabled={loading}
                  />
                  <label htmlFor={`star-${star}`}>&#9733;</label>
                </React.Fragment>
              ))}
            </StarRatingContainer>
          </FormGroup>

          <FormGroup>
            <label htmlFor="titolo">Titolo:</label>
            <input
              type="text"
              id="titolo"
              name="titolo"
              value={formData.titolo}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="descrizione">Descrizione:</label>
            <textarea
              id="descrizione"
              name="descrizione"
              value={formData.descrizione}
              onChange={handleChange}
              rows="5"
              required
              disabled={loading}
            ></textarea>
          </FormGroup>

          <ModalActions>
            <CancelButton type="button" onClick={onClose} disabled={loading}>
              Annulla
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Invio..." : "Invia Recensione"}
            </SubmitButton>
          </ModalActions>
        </ModalForm>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReviewFormModal;
