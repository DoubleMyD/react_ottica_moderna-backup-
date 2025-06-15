// src/components/ClientTypes/ClientTypeFormModal.jsx
import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  CloseButton,
  ModalForm,
  FormGroup,
  SelectTagsContainer,
  SelectedTag,
  SectionTitle,
  ProductDetailCard, // Reusing this for associated products
  RemoveProductDetailButton,
  AddProductDetailButton,
  ModalActions,
  SubmitButton,
  CancelButton,
  ErrorMessage,
} from "../../styles/Modals/StyledCreateCampaignModal"; // Reuse existing modal styles

import { STRAPI_BASE_API_URL } from "../../data/api";
import { useAuth } from "../../hooks/authContext";
import useProduct from "../../hooks/useProducts"; // For selecting associated products
import ElencoProdotti from "../ElencoProdotti/ElencoProdotti"
// Note: For client types, products are directly associated (many-to-many),
// not via a 'dettaglio_promozione' intermediate table.
//not via a 'dettaglio_promozione' intermediate table.

const ClientTypeFormModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const { authToken } = useAuth();
  const { products: availableProducts, loading: productsLoading, error: productsError } = useProduct({});

  const isEditMode = initialData !== null;

  const [clientTypeData, setClientTypeData] = useState({
    nome: "",
    descrizione: "",
    tratti_caratteristici: "",
  });
  const [associatedProductDocumentIds, setAssociatedProductDocumentIds] = useState([]); // Stores product documentIds

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (isEditMode && initialData) {
        setClientTypeData({
          nome: initialData.nome || "",
          descrizione: initialData.descrizione || "",
          tratti_caratteristici: initialData.tratti_caratteristici || "",
        });
        // Populate associated products using their documentIds
        const initialProductDocumentIds = initialData.prodottos?.map(p => p.documentId) || [];
        setAssociatedProductDocumentIds(initialProductDocumentIds);
      } else {
        setClientTypeData({
          nome: "",
          descrizione: "",
          tratti_caratteristici: "",
        });
        setAssociatedProductDocumentIds([]);
      }
    }
  }, [isOpen, isEditMode, initialData]);

  if (!isOpen) return null;

  const handleClientTypeDataChange = (e) => {
    const { name, value } = e.target;
    setClientTypeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = (e) => {
    const selectedDocumentId = e.target.value;
    if (selectedDocumentId && !associatedProductDocumentIds.includes(selectedDocumentId)) {
      setAssociatedProductDocumentIds((prev) => [...prev, selectedDocumentId]);
    }
    e.target.value = ""; // Reset select
  };

  const handleRemoveProduct = (documentIdToRemove, e) => {
    setAssociatedProductDocumentIds((prev) => prev.filter((documentId) => documentId !== documentIdToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!authToken) {
      setError("Autenticazione necessaria per procedere.");
      setLoading(false);
      return;
    }

    if (!clientTypeData.nome) {
      setError("Il nome della tipologia cliente è obbligatorio.");
      setLoading(false);
      return;
    }

    // Map selected product documentIds to Strapi internal IDs for the payload
    const productsPayload = associatedProductDocumentIds.map(docId => {
      const product = availableProducts.find(p => p.documentId === docId);
      if (!product) {
        throw new Error(`Prodotto con Document ID ${docId} non trovato. Impossibile associare.`);
      }
      return { id: product.id }; // Link by Strapi internal ID
    });

    const payload = {
      data: {
        ...clientTypeData,
        prodottos: productsPayload, // Link to associated products
      },
    };

    const method = isEditMode ? "PUT" : "POST";
    console.log("method : ", method);
    const url = isEditMode
      ? `${STRAPI_BASE_API_URL}/tipologia-clientes/${initialData.documentId}` // CORRECTED: Use documentId for PUT as per your instruction
      : `${STRAPI_BASE_API_URL}/tipologia-clientes`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Errore durante ${isEditMode ? "l'aggiornamento" : "la creazione"} della tipologia cliente.`);
      }

      alert(`Tipologia cliente ${isEditMode ? "aggiornata" : "creata"} con successo!`);
      onSuccess(); // Notify parent to close modal and refresh list
    } catch (err) {
      console.error(`Errore durante ${isEditMode ? "l'aggiornamento" : "la creazione"} della tipologia cliente:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter out the full product objects that are currently associated
  const currentAssociatedProducts = associatedProductDocumentIds
    .map(docId => availableProducts.find(p => p.documentId === docId))
    .filter(Boolean); // Filter out any undefined if a product isn't found

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalForm onSubmit={handleSubmit}>
          <ModalHeader>
            <h2>
              {isEditMode
                ? "Modifica Tipologia Cliente"
                : "Crea Nuova Tipologia Cliente"}
            </h2>
            <CloseButton onClick={onClose} disabled={loading}>
              &times;
            </CloseButton>
          </ModalHeader>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {/* Client Type General Data */}
          <FormGroup>
            <label htmlFor="nome">Nome Tipologia:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={clientTypeData.nome}
              onChange={handleClientTypeDataChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="descrizione">Descrizione:</label>
            <textarea
              id="descrizione"
              name="descrizione"
              value={clientTypeData.descrizione}
              onChange={handleClientTypeDataChange}
              rows="3"
            ></textarea>
          </FormGroup>
          <FormGroup>
            <label htmlFor="tratti_caratteristici">
              Tratti Caratteristici:
            </label>
            <textarea
              id="tratti_caratteristici"
              name="tratti_caratteristici"
              value={clientTypeData.tratti_caratteristici}
              onChange={handleClientTypeDataChange}
              rows="3"
            ></textarea>
          </FormGroup>

          {/* Associated Products Selection */}
          <SectionTitle>Prodotti Associati</SectionTitle>
          <FormGroup>
            <label htmlFor="productsSelect">Seleziona Prodotti:</label>
            {productsLoading ? (
              <p>Caricamento prodotti...</p>
            ) : productsError ? (
              <p style={{ color: "red" }}>
                Errore caricamento prodotti: {productsError}
              </p>
            ) : (
              <SelectTagsContainer>
                {/* The select dropdown to add new products */}
                <select
                  id="productsSelect"
                  onChange={handleProductSelect}
                  value=""
                >
                  <option value="" disabled>
                    Aggiungi Prodotto
                  </option>
                  {availableProducts.map(
                    (product) =>
                      !associatedProductDocumentIds.includes(
                        product.documentId
                      ) && (
                        <option
                          key={product.documentId}
                          value={product.documentId}
                        >
                          {product.nome} (ID: {product.id})
                        </option>
                      )
                  )}
                </select>
              </SelectTagsContainer>
            )}
            {/* Display associated products using ElencoProdotti, passing the desired columnWidth */}
            <ElencoProdotti
              products={currentAssociatedProducts}
              showProductDetailLink={false}
              isTagMode={true}
              onRemove={handleRemoveProduct}
              columnWidth="150px"
            />
          </FormGroup>

          <ModalActions>
            <CancelButton type="button" onClick={onClose} disabled={loading}>
              Annulla
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading
                ? isEditMode
                  ? "Aggiornamento..."
                  : "Creazione..."
                : isEditMode
                ? "Aggiorna Tipologia"
                : "Crea Tipologia"}
            </SubmitButton>
          </ModalActions>
        </ModalForm>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ClientTypeFormModal;
