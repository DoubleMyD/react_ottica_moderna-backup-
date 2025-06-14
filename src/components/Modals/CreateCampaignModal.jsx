// src/components/Admin/Marketing/CreateCampaignModal.jsx
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
  ProductDetailCard,
  RemoveProductDetailButton,
  AddProductDetailButton,
  ModalActions,
  SubmitButton,
  CancelButton,
  ErrorMessage,
} from "../../styles/Modals/StyledCreateCampaignModal"; // Ensure path is correct

import { STRAPI_BASE_API_URL } from "../../data/api";
import { useAuth } from "../../hooks/authContext";
import useClientTypes from "../../hooks/useClientTypes"; // New hook for client types
import useProducts from "../../hooks/useProduct"; // Reusing the general product hook

const CreateCampaignModal = ({ isOpen, onClose, onCreateSuccess }) => {
  const { authToken } = useAuth();
  const { clientTypes: availableClientTypes, loading: clientTypesLoading, error: clientTypesError } = useClientTypes();
  // Using useProducts for the list of available products to choose from
  const { products: availableProducts, loading: productsLoading, error: productsError } = useProducts({}); // Pass empty filters for all products

  const [campaignData, setCampaignData] = useState({
    titolo: "",
    descrizione: "",
    data_inizio: "",
    data_fine: "",
    codice: "",
  });
  const [selectedClientTypeIds, setSelectedClientTypeIds] = useState([]); // Stores Strapi internal IDs
  const [promotionDetails, setPromotionDetails] = useState([]); // Array of { productId, tipo_applicazione, valore }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset form when modal opens if it was previously closed
    if (isOpen) {
      setCampaignData({
        titolo: "",
        descrizione: "",
        data_inizio: "",
        data_fine: "",
        codice: "",
      });
      setSelectedClientTypeIds([]);
      setPromotionDetails([]);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCampaignDataChange = (e) => {
    const { name, value } = e.target;
    setCampaignData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClientTypeSelect = (e) => {
    const selectedId = e.target.value;
    if (selectedId && !selectedClientTypeIds.includes(selectedId)) {
      setSelectedClientTypeIds((prev) => [...prev, selectedId]);
    }
    e.target.value = ""; // Reset select
  };

  const handleRemoveClientType = (idToRemove) => {
    setSelectedClientTypeIds((prev) => prev.filter((id) => id !== idToRemove));
  };

  const handleAddProductDetail = () => {
    setPromotionDetails((prev) => [
      ...prev,
      { productId: "", tipo_applicazione: "percentuale", valore: "" }, // Default values
    ]);
  };

  const handleRemoveProductDetail = (index) => {
    setPromotionDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProductDetailChange = (index, field, value) => {
    setPromotionDetails((prev) =>
      prev.map((detail, i) =>
        i === index
          ? { ...detail, [field]: field === "valore" ? parseFloat(value) : value }
          : detail
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!authToken) {
      setError("Autenticazione necessaria per creare la campagna.");
      setLoading(false);
      return;
    }

    // Basic validation
    if (!campaignData.titolo || !campaignData.data_inizio || !campaignData.data_fine) {
      setError("Titolo, data inizio e data fine sono obbligatori.");
      setLoading(false);
      return;
    }

    // Convert local date/time to ISO string
    const dataInizioISO = campaignData.data_inizio ? new Date(campaignData.data_inizio).toISOString() : null;
    const dataFineISO = campaignData.data_fine ? new Date(campaignData.data_fine).toISOString() : null;

    // Map selected client types to Strapi's expected format (array of IDs)
    const tipologiaClientesPayload = selectedClientTypeIds.map(id => ({ id }));

    // Map promotion details for Strapi
    const dettaglioPromozionisPayload = promotionDetails.map(detail => {
      const selectedProduct = availableProducts.find(p => p.id === detail.productId);
      return {
        tipo_applicazione: detail.tipo_applicazione,
        valore: detail.valore,
        prodotto: selectedProduct ? { id: selectedProduct.id } : null, // Link by Strapi internal ID
      };
    });

    const payload = {
      data: {
        ...campaignData,
        data_inizio: dataInizioISO,
        data_fine: dataFineISO,
        tipologia_clientes: tipologiaClientesPayload,
        dettaglio_promozionis: dettaglioPromozionisPayload,
        // cod_amministratore: { id: userIdFromAuth } // If you need to link to the admin user
      },
    };

    try {
      const response = await fetch(`${STRAPI_BASE_API_URL}/promoziones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Errore durante la creazione della campagna.");
      }

      const newCampaign = await response.json();
      console.log("Campagna creata con successo:", newCampaign);
      alert("Campagna promozionale creata con successo!");

      onCreateSuccess(); // Notify parent to close modal and refresh list
    } catch (err) {
      console.error("Errore creazione campagna:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedClientTypeNames = () => {
    return selectedClientTypeIds.map(id => {
      const type = availableClientTypes.find(ct => ct.id === id);
      return type ? type.nome : `ID sconosciuto (${id})`;
    });
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Crea Nuova Campagna Promozionale</h2>
          <CloseButton onClick={onClose} disabled={loading}>
            &times;
          </CloseButton>
        </ModalHeader>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ModalForm onSubmit={handleSubmit}>
          {/* Campaign General Data */}
          <FormGroup>
            <label htmlFor="titolo">Titolo Campagna:</label>
            <input
              type="text"
              id="titolo"
              name="titolo"
              value={campaignData.titolo}
              onChange={handleCampaignDataChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="descrizione">Descrizione:</label>
            <textarea
              id="descrizione"
              name="descrizione"
              value={campaignData.descrizione}
              onChange={handleCampaignDataChange}
              rows="3"
            ></textarea>
          </FormGroup>
          <FormGroup>
            <label htmlFor="codice">Codice Promozione (Opzionale):</label>
            <input
              type="text"
              id="codice"
              name="codice"
              value={campaignData.codice}
              onChange={handleCampaignDataChange}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="data_inizio">Data Inizio:</label>
            <input
              type="datetime-local"
              id="data_inizio"
              name="data_inizio"
              value={campaignData.data_inizio}
              onChange={handleCampaignDataChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="data_fine">Data Fine:</label>
            <input
              type="datetime-local"
              id="data_fine"
              name="data_fine"
              value={campaignData.data_fine}
              onChange={handleCampaignDataChange}
              required
            />
          </FormGroup>

          {/* Client Types Selection */}
          <SectionTitle>Tipologie Clienti Target</SectionTitle>
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
                {selectedClientTypeIds.map((id) => (
                  <SelectedTag key={id}>
                    {availableClientTypes.find((ct) => ct.id === parseFloat(id))
                      ?.nome || `ID: ${id}`}
                    <button
                      type="button"
                      onClick={() => handleRemoveClientType(id)}
                    >
                      &times;
                    </button>
                  </SelectedTag>
                ))}
                <select
                  id="clientTypesSelect"
                  onChange={handleClientTypeSelect}
                  value=""
                >
                  <option value="" disabled>
                    Aggiungi Tipologia
                  </option>
                  {availableClientTypes.map(
                    (type) =>
                      // Only show types not already selected
                      !selectedClientTypeIds.includes(type.id) && (
                        <option key={type.id} value={type.id}>
                          {type.nome}
                        </option>
                      )
                  )}
                </select>
              </SelectTagsContainer>
            )}
          </FormGroup>

          {/* Promotion Details (Products) */}
          <SectionTitle>Dettagli Promozione (Prodotti)</SectionTitle>
          {promotionDetails.map((detail, index) => (
            <ProductDetailCard key={index}>
              <RemoveProductDetailButton
                type="button"
                onClick={() => handleRemoveProductDetail(index)}
              >
                &times;
              </RemoveProductDetailButton>
              <FormGroup>
                <label htmlFor={`product-${index}`}>Prodotto:</label>
                {productsLoading ? (
                  <p>Caricamento prodotti...</p>
                ) : productsError ? (
                  <p style={{ color: "red" }}>
                    Errore caricamento prodotti: {productsError}
                  </p>
                ) : (
                  <select
                    id={`product-${index}`}
                    value={detail.productId}
                    onChange={(e) =>
                      handleProductDetailChange(
                        index,
                        "productId",
                        e.target.value
                      )
                    }
                    required
                  >
                    <option value="">Seleziona un prodotto</option>
                    {availableProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.nome} (ID: {product.id})
                      </option>
                    ))}
                  </select>
                )}
              </FormGroup>
              <FormGroup>
                <label htmlFor={`tipo_applicazione-${index}`}>
                  Tipo Applicazione:
                </label>
                <select
                  id={`tipo_applicazione-${index}`}
                  value={detail.tipo_applicazione}
                  onChange={(e) =>
                    handleProductDetailChange(
                      index,
                      "tipo_applicazione",
                      e.target.value
                    )
                  }
                  required
                >
                  <option value="percentuale">Percentuale</option>
                  <option value="fisso">Fisso</option>
                  <option value="sconto">Sconto</option>{" "}
                  {/* Assuming 'sconto' is a valid type based on your schema */}
                  {/* Add other types as per your Strapi schema for tipo_applicazione */}
                </select>
              </FormGroup>
              <FormGroup>
                <label htmlFor={`valore-${index}`}>Valore:</label>
                <input
                  type="number"
                  id={`valore-${index}`}
                  value={detail.valore}
                  onChange={(e) =>
                    handleProductDetailChange(index, "valore", e.target.value)
                  }
                  step="0.01"
                  required
                />
              </FormGroup>
            </ProductDetailCard>
          ))}
          <AddProductDetailButton
            type="button"
            onClick={handleAddProductDetail}
          >
            + Aggiungi Dettaglio Prodotto
          </AddProductDetailButton>

          {/* Form Actions */}
          <ModalActions>
            <CancelButton type="button" onClick={onClose} disabled={loading}>
              Annulla
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Creazione..." : "Crea Campagna"}
            </SubmitButton>
          </ModalActions>
        </ModalForm>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateCampaignModal;