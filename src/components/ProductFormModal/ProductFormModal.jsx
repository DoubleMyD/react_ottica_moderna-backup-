// src/components/Admin/Product/ProductFormModal.jsx
import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  CloseButton,
  ModalForm,
  FormGroup,
  FileInputContainer,
  ModalActions,
  SubmitButton,
  CancelButton,
  ErrorMessage,
} from "./StyledProductFormModal"; // This file will be renamed in the next step
import { STRAPI_BASE_API_URL, STRAPI_BASE_URL } from "../../data/api"; // Ensure STRAPI_BASE_URL is here
import { useAuth } from "../../hooks/authContext";

const ProductFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
}) => {
  const { authToken } = useAuth();
  const [formData, setFormData] = useState({
    nome: "",
    quantita_disponibili: "",
    prezzo_unitario: "",
    tipologia: "",
    descrizione: "",
    brand: "",
  });
  const [imageFile, setImageFile] = useState(null); // For new image upload
  const [imagePreview, setImagePreview] = useState(null); // For image preview (new or existing)
  const [existingImageId, setExistingImageId] = useState(null); // To keep track of Strapi ID of existing image
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = initialData !== null;

  // Effect to populate form when initialData changes (for edit mode)
  useEffect(() => {
    if (isOpen && isEditMode && initialData) {
      setFormData({
        nome: initialData.nome || "",
        quantita_disponibili: initialData.quantita_disponibili || "",
        prezzo_unitario: initialData.prezzo_unitario || "",
        tipologia: initialData.tipologia || "",
        descrizione: initialData.descrizione || "",
        brand: initialData.brand || "",
      });
      // Set existing image for preview and ID
      if (initialData.immagine && initialData.immagine.url) {
        setImagePreview(`${STRAPI_BASE_URL}${initialData.immagine.url}`); // Use full URL for preview
        setExistingImageId(initialData.immagine.id); // Store the ID of the existing image
      } else {
        setImagePreview(null);
        setExistingImageId(null);
      }
      setError(null); // Clear any previous errors
    } else if (isOpen && !isEditMode) {
      // Reset form for create mode when modal opens
      setFormData({
        nome: "",
        quantita_disponibili: "",
        prezzo_unitario: "",
        tipologia: "",
        descrizione: "",
        brand: "",
      });
      setImageFile(null);
      setImagePreview(null);
      setExistingImageId(null);
      setError(null);
    }
  }, [isOpen, initialData, isEditMode]); // Re-run when modal opens or initialData changes

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the actual file
      setExistingImageId(null); // Clear existing image ID if a new file is chosen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set preview to new image
      };
      reader.readAsDataURL(file);
    } else {
      // If file input is cleared, clear new image and revert to existing if any
      setImageFile(null);
      if (initialData?.immagine?.url) {
        setImagePreview(`${STRAPI_BASE_URL}${initialData.immagine.url}`);
        setExistingImageId(initialData.immagine.id);
      } else {
        setImagePreview(null);
        setExistingImageId(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!authToken) {
      setError("Autenticazione necessaria.");
      setLoading(false);
      return;
    }

    let finalImageId = existingImageId; // Start with existing image ID

    try {
      // Step 1: Handle Image Upload/Retention
      if (imageFile) {
        // If a new file is selected, upload it
        const imageFormData = new FormData();
        imageFormData.append("files", imageFile);

        const uploadResponse = await fetch(`${STRAPI_BASE_API_URL}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(
            errorData.error?.message ||
              "Errore durante l'upload della nuova immagine."
          );
        }
        const uploadedImages = await uploadResponse.json();
        if (uploadedImages && uploadedImages.length > 0) {
          finalImageId = uploadedImages[0].id; // Use new image ID
        } else {
          finalImageId = null; // No image uploaded, or upload failed to return ID
        }
      } else if (imagePreview === null && existingImageId) {
        // If image was cleared by user (imagePreview is null) but there was an existing image,
        // it means user wants to remove the image. So set finalImageId to null.
        finalImageId = null;
      }
      // If imageFile is null AND imagePreview is not null AND existingImageId is not null,
      // it means user kept the existing image, so finalImageId remains existingImageId.

      // Step 2: Create or Update Product Entry
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `${STRAPI_BASE_API_URL}/prodottos/${initialData.documentId}` // Use Strapi internal ID for PUT
        : `${STRAPI_BASE_API_URL}/prodottos`;

      const productPayload = {
        data: {
          ...formData,
          immagine: finalImageId ? [finalImageId] : null, // Link image by ID
        },
      };

      const apiResponse = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(productPayload),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(
          errorData.error?.message ||
            `Errore durante ${
              isEditMode ? "l'aggiornamento" : "la creazione"
            } del prodotto.`
        );
      }

      const responseData = await apiResponse.json();
      console.log(
        `Prodotto ${isEditMode ? "aggiornato" : "creato"} con successo:`,
        responseData
      );
      alert(`Prodotto ${isEditMode ? "aggiornato" : "creato"} con successo!`);

      onSuccess(); // Callback to parent to close modal and refresh list
    } catch (err) {
      console.error("Errore operazione prodotto:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>{isEditMode ? "Modifica Prodotto" : "Crea Nuovo Prodotto"}</h2>
          <CloseButton onClick={onClose} disabled={loading}>
            &times;
          </CloseButton>
        </ModalHeader>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ModalForm onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="quantita_disponibili">Quantità Disponibili:</label>
            <input
              type="number"
              id="quantita_disponibili"
              name="quantita_disponibili"
              value={formData.quantita_disponibili}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="prezzo_unitario">Prezzo Unitario:</label>
            <input
              type="number"
              id="prezzo_unitario"
              name="prezzo_unitario"
              value={formData.prezzo_unitario}
              onChange={handleChange}
              step="0.01"
              required
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="tipologia">Tipologia:</label>
            <input
              type="text"
              id="tipologia"
              name="tipologia"
              value={formData.tipologia}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="descrizione">Descrizione:</label>
            <textarea
              id="descrizione"
              name="descrizione"
              value={formData.descrizione}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </FormGroup>
          <FormGroup>
            <label htmlFor="brand">Brand:</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FileInputContainer>
            <label htmlFor="immagine">Immagine Prodotto:</label>
            <input
              type="file"
              id="immagine"
              name="immagine"
              accept="image/png"
              onChange={handleFileChange}
            />
            <label htmlFor="immagine" className="custom-file-input">
              {imagePreview ? "Cambia Immagine" : "Scegli Immagine"}
            </label>
            {imageFile && <span className="file-name">{imageFile.name}</span>}
            {imagePreview && (
              <>
                <img src={imagePreview} alt="Anteprima Immagine" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    setExistingImageId(null);
                  }}
                  style={{
                    background: "none",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    marginTop: "5px",
                    cursor: "pointer",
                  }}
                >
                  Rimuovi Immagine
                </button>
              </>
            )}
          </FileInputContainer>

          <ModalActions>
            <CancelButton type="button" onClick={onClose} disabled={loading}>
              Annulla
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading
                ? "Processo..."
                : isEditMode
                ? "Aggiorna Prodotto"
                : "Crea Prodotto"}
            </SubmitButton>
          </ModalActions>
        </ModalForm>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProductFormModal;
