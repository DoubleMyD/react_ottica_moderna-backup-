// src/components/Admin/Marketing/CampaignFormModal.jsx
import React, { useState, useEffect, useMemo } from "react";
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
} from "../../../styles/Modals/StyledCreateCampaignModal"; // Reuse existing styles

import { STRAPI_BASE_API_URL } from "../../../data/api";
import { useAuth } from "../../../hooks/authContext";
import useClientTypes from "../../../hooks/useClientTypes";
import useProduct from "../../../hooks/useProducts";
import useProductPromotions from "../../../hooks/useProductPromotion";

// This modal will now handle both creation and editing of campaigns
const CampaignFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
}) => {
  const { authToken } = useAuth();

  // Memoize filterOptions for useClientTypes to prevent infinite loop
  const clientTypeFilterOptions = useMemo(() => ({}), []); // No filters needed for this dropdown, so empty object
  
  const {
    clientTypes: availableClientTypes,
    loading: clientTypesLoading,
    error: clientTypesError,
  } = useClientTypes(clientTypeFilterOptions);

  // Memoize filterOptions for useProducts to prevent infinite loop
  const productFilterOptions = useMemo(() => ({}), []); // No filters needed for this dropdown, so empty object

  const {
    products: availableProducts,
    loading: productsLoading,
    error: productsError,
  } = useProduct(productFilterOptions);

  const isEditMode = initialData !== null;

  const [campaignData, setCampaignData] = useState({
    titolo: "",
    descrizione: "",
    data_inizio: "",
    data_fine: "",
    codice: "",
  });
  const [selectedClientTypeIds, setSelectedClientTypeIds] = useState([]); // Stores Strapi internal IDs of client types
  const [promotionDetails, setPromotionDetails] = useState([]); // Array of { productDocumentId, tipo_applicazione, valore, dettaglioId (for existing) }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect to populate form when in edit mode or reset for create mode
  useEffect(() => {
    if (isOpen) {
      setError(null); // Clear any previous errors
      console.log("Campaign inital data : ", initialData);
      if (isEditMode && initialData) {
        // Populate campaign data
        setCampaignData({
          titolo: initialData.titolo || "",
          descrizione: initialData.descrizione || "",
          data_inizio: initialData.data_inizio
            ? initialData.data_inizio.substring(0, 16)
            : "", // Format to local datetime input
          data_fine: initialData.data_fine
            ? initialData.data_fine.substring(0, 16)
            : "", // Format to local datetime input
          codice: initialData.codice || "",
        });

        // Populate selected client types
        const initialClientTypeIds =
          initialData.tipologia_clientes?.map((tc) => tc.id) || [];
        setSelectedClientTypeIds(initialClientTypeIds);

        // Populate promotion details (products)
        const initialPromotionDetails =
          initialData.dettaglio_promozionis?.map((dp) => ({
            productDocumentId: dp.prodottos?.[0]?.documentId || "", // Assuming prodottos is an array and we take the first
            tipo_applicazione: dp.tipo_applicazione || "percentuale",
            valore: dp.valore || "",
            id: dp.id, // Store existing dettaglio_promozione ID for updates/deletions
            documentId: dp.documentId,
          })) || [];
        setPromotionDetails(initialPromotionDetails);
      } else {
        // Reset form for create mode
        setCampaignData({
          titolo: "",
          descrizione: "",
          data_inizio: "",
          data_fine: "",
          codice: "",
        });
        setSelectedClientTypeIds([]);
        setPromotionDetails([]);
      }
    }
  }, [isOpen, isEditMode, initialData]);

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
    e.target.value = "";
  };

  const handleRemoveClientType = (idToRemove) => {
    setSelectedClientTypeIds((prev) => prev.filter((id) => id !== idToRemove));
  };

  const handleAddProductDetail = () => {
    setPromotionDetails((prev) => [
      ...prev,
      { productDocumentId: "", tipo_applicazione: "percentuale", valore: "" },
    ]);
  };

  const handleRemoveProductDetail = (indexToRemove) => {
    setPromotionDetails((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleProductDetailChange = (index, field, value) => {
    setPromotionDetails((prev) =>
      prev.map((detail, i) =>
        i === index
          ? {
              ...detail,
              [field]: field === "valore" ? parseFloat(value) : value,
            }
          : detail
      )
    );
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

    if (
      !campaignData.titolo ||
      !campaignData.data_inizio ||
      !campaignData.data_fine
    ) {
      setError("Titolo, data inizio e data fine sono obbligatori.");
      setLoading(false);
      return;
    }

    const dataInizioISO = campaignData.data_inizio
      ? new Date(campaignData.data_inizio).toISOString()
      : null;
    const dataFineISO = campaignData.data_fine
      ? new Date(campaignData.data_fine).toISOString()
      : null;

    const tipologiaClientesPayload = selectedClientTypeIds.map((id) => ({
      id,
    }));

    console.log("form modal ", initialData);
    let promotionStrapiId = initialData?.id || null; // For edit mode, use existing ID
    let promotionDocumentId = initialData?.documentId;

    try {
      // --- Step 1: Create or Update the main Promotion entry ---
      const mainPromotionPayload = {
        data: {
          titolo: campaignData.titolo,
          descrizione: campaignData.descrizione,
          data_inizio: dataInizioISO,
          data_fine: dataFineISO,
          codice: campaignData.codice,
          tipologia_clientes: tipologiaClientesPayload,
        },
      };

      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `${STRAPI_BASE_API_URL}/promoziones/${promotionDocumentId}`
        : `${STRAPI_BASE_API_URL}/promoziones`;

      const mainPromotionResponse = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(mainPromotionPayload),
      });

      if (!mainPromotionResponse.ok) {
        const errorData = await mainPromotionResponse.json();
        throw new Error(
          errorData.error?.message ||
            `Errore durante ${
              isEditMode ? "l'aggiornamento" : "la creazione"
            } della campagna principale.`
        );
      }

      const responseData = await mainPromotionResponse.json();
      promotionStrapiId = responseData.data.id; // Get the ID, whether newly created or existing

      console.log(
        `Campagna principale ${
          isEditMode ? "aggiornata" : "creata"
        } con successo. ID:`,
        promotionStrapiId
      );

      // --- Step 2: Handle Dettaglio Promozionis entries ---
      // For existing details, determine what changed (updated, deleted)
      // For new details, create them
      const existingDetailIds = new Set(
        initialData?.dettaglio_promozionis?.map((dp) => dp.id) || []
      );
      const currentDetailIdsInForm = new Set(
        promotionDetails.filter((pd) => pd.id).map((pd) => pd.id)
      );

      const detailsToCreate = promotionDetails.filter((detail) => !detail.id); // No ID, so new
      const detailsToUpdate = promotionDetails.filter(
        (detail) => detail.id && existingDetailIds.has(detail.id)
      ); // Has ID and exists
      const detailsToDeleteIds = Array.from(existingDetailIds).filter(
        (id) => !currentDetailIdsInForm.has(id)
      ); // Existed, but not in current form

      const detailPromises = [];

      // Create new details
      detailsToCreate.forEach((detail) => {
        const selectedProduct = availableProducts.find(
          (p) => p.documentId === detail.productDocumentId
        );
        if (!selectedProduct) {
          console.warn(
            `Skipping new detail: Product with Document ID ${detail.productDocumentId} not found.`
          );
          return;
        }
        detailPromises.push(
          fetch(`${STRAPI_BASE_API_URL}/dettaglio-promozionis`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              data: {
                tipo_applicazione: detail.tipo_applicazione,
                valore: detail.valore,
                prodottos: [{ id: selectedProduct.id }],
                promoziones: [{ id: promotionStrapiId }], // Link to the main promotion
              },
            }),
          }).then((res) => {
            if (!res.ok)
              throw new Error(
                `Failed to create detail for product ${selectedProduct.nome}: ${res.statusText}`
              );
            return res.json();
          })
        );
      });

      // Update existing details
      detailsToUpdate.forEach((detail) => {
        const selectedProduct = availableProducts.find(
          (p) => p.documentId === detail.productDocumentId
        );
        if (!selectedProduct) {
          console.warn(
            `Skipping update for detail ${detail.id}: Product with Document ID ${detail.documentId} not found.`
          );
          return;
        }
        console.log("detail od promo :", detail);
        detailPromises.push(
          fetch(
            `${STRAPI_BASE_API_URL}/dettaglio-promozionis/${detail.documentId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({
                data: {
                  tipo_applicazione: detail.tipo_applicazione,
                  valore: detail.valore,
                  prodottos: [{ id: selectedProduct.id }],
                  promoziones: [{ id: promotionStrapiId }], // Ensure link is maintained
                },
              }),
            }
          ).then((res) => {
            if (!res.ok)
              throw new Error(
                `Failed to update detail ${detail.id} for product ${selectedProduct.nome}: ${res.statusText}`
              );
            return res.json();
          })
        );
      });

      // Delete removed details
      detailsToDeleteIds.forEach((id) => {
        detailPromises.push(
          fetch(`${STRAPI_BASE_API_URL}/dettaglio-promozionis/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${authToken}` },
          }).then((res) => {
            if (!res.ok)
              throw new Error(
                `Failed to delete detail ${id}: ${res.statusText}`
              );
            return res.json();
          })
        );
      });

      const detailResults = await Promise.allSettled(detailPromises);
      const failedDetailOps = detailResults.filter(
        (result) => result.status === "rejected"
      );

      if (failedDetailOps.length > 0) {
        console.warn(
          "Alcune operazioni sui dettagli promozione sono fallite:",
          failedDetailOps
        );
        setError(
          `Campagna ${isEditMode ? "aggiornata" : "creata"}, ma con errori su ${
            failedDetailOps.length
          } dettagli.`
        );
      } else {
        alert(
          `Campagna promozionale ${
            isEditMode ? "aggiornata" : "creata"
          } con successo!`
        );
      }

      onSuccess(); // Notify parent to close modal and refresh list
    } catch (err) {
      console.error(
        `Errore durante ${
          isEditMode ? "l'aggiornamento" : "la creazione"
        } della campagna:`,
        err
      );
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedClientTypeNames = () => {
    return selectedClientTypeIds.map((id) => {
      const type = availableClientTypes.find((ct) => ct.id === id);
      return type ? type.nome : `ID sconosciuto (${id})`;
    });
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>
            {isEditMode
              ? "Modifica Campagna Promozionale"
              : "Crea Nuova Campagna Promozionale"}
          </h2>
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
            <ProductDetailCard key={detail.id || `new-${index}`}>
              {" "}
              {/* Use detail.id for existing, else new-index */}
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
                    value={detail.productDocumentId}
                    onChange={(e) =>
                      handleProductDetailChange(
                        index,
                        "productDocumentId",
                        e.target.value
                      )
                    }
                    required
                  >
                    <option value="">Seleziona un prodotto</option>
                    {availableProducts.map((product) => (
                      <option
                        key={product.documentId}
                        value={product.documentId}
                      >
                        {product.nome}
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
                  <option value="sconto">Sconto</option>
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
              {loading
                ? isEditMode
                  ? "Aggiornamento..."
                  : "Creazione..."
                : isEditMode
                ? "Aggiorna Campagna"
                : "Crea Campagna"}
            </SubmitButton>
          </ModalActions>
        </ModalForm>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CampaignFormModal;
