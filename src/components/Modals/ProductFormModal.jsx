// src/components/Admin/Product/ProductFormModal.jsx
import React, { useState, useEffect, useMemo } from "react"; // Added useMemo
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
  
} from "../../styles/Modals/StyledProductFormModal"; // Assuming these styles are available or will be moved here
import {// Imported from StyledCreateCampaignModal for SelectTagsContainer, SelectedTag, SectionTitle
  SelectTagsContainer,
  SelectedTag,
  SectionTitle} from "../../styles/Modals/StyledCreateCampaignModal";

import { STRAPI_BASE_API_URL, STRAPI_BASE_URL } from "../../data/api";
import { useAuth } from "../../hooks/authContext";
import useClientTypes from "../../hooks/useClientTypes"; // Import useClientTypes

// Import PRODUCT_CATEGORIES from constants file
import { PRODUCT_CATEGORIES } from "../../data/constants"; // Assuming this path is correct

import FaqFormModal from "../Admin/Product/FaqFormModal";


const ProductFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
  onFaqSuccess,
}) => {
  const { authToken } = useAuth();
  const [formData, setFormData] = useState({
    nome: "",
    quantita_disponibili: "",
    prezzo_unitario: "",
    tipologia: "", // Will be selected from dropdown (string value)
    descrizione: "",
    brand: "",
  });
  const [imageFile, setImageFile] = useState(null); // For new image upload
  const [imagePreview, setImagePreview] = useState(null); // For image preview (new or existing)
  const [existingImageId, setExistingImageId] = useState(null); // To keep track of Strapi ID of existing image
  const [selectedClientTypeIds, setSelectedClientTypeIds] = useState([]); // Stores Strapi internal IDs of client types
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  const isEditMode = initialData !== null;

  // Fetch all client types to populate the "Tipologie Clienti Associate" dropdown
  const clientTypeFilterOptions = useMemo(() => ({}), []); // No specific filters needed for this list
  const {
    clientTypes: availableClientTypes,
    loading: clientTypesLoading,
    error: clientTypesError,
  } = useClientTypes(clientTypeFilterOptions);

  // Effect to populate form when initialData changes (for edit mode)
  // or reset for create mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null); // Clear any previous errors

      if (isEditMode && initialData) {
        setFormData({
          nome: initialData.nome || "",
          quantita_disponibili: initialData.quantita_disponibili || "",
          prezzo_unitario: initialData.prezzo_unitario || "",
          tipologia: initialData.tipologia || "", // Set existing string tipologia
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

        // Populate selected client types for the product
        // InitialData.tipologia_clientes might be an array of objects with { id, nome, documentId }
        const initialClientTypeIds =
          initialData.tipologia_clientes?.map((tc) => tc.id) || [];
        setSelectedClientTypeIds(initialClientTypeIds);
      } else {
        // Reset form for create mode
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
        setSelectedClientTypeIds([]); // Reset selected client types
      }
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

  const handleClientTypeSelect = (e) => {
    const selectedId = parseFloat(e.target.value); // Ensure ID is a number
    if (!isNaN(selectedId) && !selectedClientTypeIds.includes(selectedId)) {
      setSelectedClientTypeIds((prev) => [...prev, selectedId]);
    }
    e.target.value = ""; // Reset dropdown
  };

  const handleRemoveClientType = (idToRemove) => {
    setSelectedClientTypeIds((prev) => prev.filter((id) => id !== idToRemove));
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

    // --- Validation ---
    const requiredFields = [
      "nome",
      "quantita_disponibili",
      "prezzo_unitario",
      "tipologia",
      "descrizione",
      "brand",
    ];
    for (const field of requiredFields) {
      // Check if the field is empty or contains only whitespace for strings
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && formData[field].trim() === "")
      ) {
        setError(`Il campo '${field}' è obbligatorio.`);
        setLoading(false);
        return;
      }
    }

    // Specific validation for numbers
    if (
      isNaN(formData.quantita_disponibili) ||
      formData.quantita_disponibili < 0
    ) {
      setError("La 'Quantità Disponibile' deve essere un numero non negativo.");
      setLoading(false);
      return;
    }
    if (isNaN(formData.prezzo_unitario) || formData.prezzo_unitario <= 0) {
      setError("Il 'Prezzo Unitario' deve essere un numero positivo.");
      setLoading(false);
      return;
    }

    // Image validation (required for new product, optional for edit if already exists)
    if (!isEditMode && !imageFile) {
      setError("L'immagine del prodotto è obbligatoria per un nuovo prodotto.");
      setLoading(false);
      return;
    }
    if (isEditMode && !imageFile && !existingImageId) {
      // This case means it's an edit, no new file, and no existing image, implying removal
      // If user explicitly removed it, and it's allowed, then it's fine.
      // For now, if no image is present in edit mode, it's an error as per the prompt.
      setError(
        "Per la modifica, è richiesta un'immagine o deve essere mantenuta quella esistente."
      );
      setLoading(false);
      return;
    }

    let finalImageId = existingImageId; // Start with existing image ID

    try {
      // Step 1: Handle Image Upload/Retention
      if (imageFile) {
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
          finalImageId = uploadedImages[0].id;
        } else {
          finalImageId = null;
        }
      } else if (imagePreview === null && existingImageId) {
        finalImageId = null; // Image was explicitly cleared by the user
      }

      // Prepare tipologia_clientes payload
      const tipologiaClientesPayload = selectedClientTypeIds.map((id) => ({
        id,
      }));

      // Step 2: Create or Update Product Entry
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `${STRAPI_BASE_API_URL}/prodottos/${initialData.documentId}` // Use documentId for PUT
        : `${STRAPI_BASE_API_URL}/prodottos`;

      const productPayload = {
        data: {
          ...formData,
          immagine: finalImageId ? [finalImageId] : null, // Link image by ID
          tipologia_clientes: tipologiaClientesPayload, // Add selected client types
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

      onSuccess();
    } catch (err) {
      console.error("Errore operazione prodotto:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFaqModal = () => {
    // Only allow opening FAQ modal in edit mode (i.e., product already exists)
    if (isEditMode && initialData?.documentId) {
      setIsFaqModalOpen(true);
    } else {
      setError(
        "Devi prima creare o selezionare un prodotto per gestire le FAQ."
      );
    }
  };

  const handleCloseFaqModal = () => {
    setIsFaqModalOpen(false);
    // Optionally, re-fetch product data here if FAQ changes might affect product display
  };

  const handleFaqSuccess = () => {
    onFaqSuccess();
    setIsFaqModalOpen(true);
  }

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
              min="0"
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
              min="0.01"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="tipologia">Tipologia:</label>
            <select
              id="tipologia"
              name="tipologia"
              value={formData.tipologia}
              onChange={handleChange}
              required
            >
              <option value="">Seleziona una tipologia</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup>
            <label htmlFor="descrizione">Descrizione:</label>
            <textarea
              id="descrizione"
              name="descrizione"
              value={formData.descrizione}
              onChange={handleChange}
              rows="4"
              required
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

          {/* New Section for Tipologie Clienti Associate */}
          <SectionTitle>Tipologie Clienti Associate</SectionTitle>
          <FormGroup>
            <label htmlFor="clientTypesSelect">Seleziona Tipologie:</label>
            {clientTypesLoading ? (
              <p>Caricamento tipologie clienti...</p>
            ) : clientTypesError ? (
              <p style={{ color: "red" }}>
                Errore caricamento tipologie: {clientTypesError}
              </p>
            ) : (
              <SelectTagsContainer>
                {selectedClientTypeIds.map((id) => {
                  const type = availableClientTypes.find((ct) => ct.id === id);
                  return (
                    <SelectedTag key={id}>
                      {type ? type.nome : `ID: ${id}`}
                      <button
                        type="button"
                        onClick={() => handleRemoveClientType(id)}
                      >
                        &times;
                      </button>
                    </SelectedTag>
                  );
                })}
                <select
                  id="clientTypesSelect"
                  onChange={handleClientTypeSelect}
                  value="" // Always keep value="" to show "Aggiungi Tipologia"
                >
                  <option value="" disabled>
                    Aggiungi Tipologia
                  </option>
                  {availableClientTypes.map(
                    (type) =>
                      !selectedClientTypeIds.includes(type.id) && ( // Only show unselected types
                        <option key={type.id} value={type.id}>
                          {type.nome}
                        </option>
                      )
                  )}
                </select>
              </SelectTagsContainer>
            )}
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
              {imageFile
                ? "Cambia Immagine"
                : imagePreview
                ? "Cambia Immagine"
                : "Scegli Immagine"}
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
                    const fileInput = document.getElementById("immagine");
                    if (fileInput) fileInput.value = "";
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
            {isEditMode && (
              <SubmitButton
                type="button"
                onClick={handleOpenFaqModal}
                disabled={loading || !initialData?.documentId} // Disable if not in edit mode or no product ID
                style={{ backgroundColor: "#6c757d", marginRight: "auto" }} // Gray button, left-aligned
              >
                Gestisci FAQ
              </SubmitButton>
            )}
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

      {/* FaqFormModal renders here, conditionally */}
      <FaqFormModal
        isOpen={isFaqModalOpen}
        onClose={handleCloseFaqModal}
        productId={initialData?.documentId} // Pass the product ID to the FAQ modal
        onSuccess={handleFaqSuccess}
      />
    </ModalOverlay>
  );
};

export default ProductFormModal;
