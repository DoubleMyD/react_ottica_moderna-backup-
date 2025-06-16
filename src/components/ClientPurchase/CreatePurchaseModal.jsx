// src/components/Client/Purchase/CreatePurchaseModal.jsx
import React, { useState, useEffect, useCallback } from "react";
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
import { buildQueryStringV5 } from "../../utils/buildQueryString"; // Assuming this utility exists
import useUserAndClienteData from "../../hooks/useUserAndClienteData";

// --- Styled Components for CreatePurchaseModal ---
const LineItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
  position: relative; // For remove button positioning
`;

const RemoveLineItemButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
  color: #dc3545;
  cursor: pointer;
  padding: 5px;
  line-height: 1;

  &:hover {
    color: #c82333;
    transform: scale(1.1);
  }
`;

const AddLineItemButton = styled(SubmitButton)`
  background-color: #007bff;
  margin-top: 10px;
  &:hover {
    background-color: #0056b3;
  }
`;

const TotalsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-top: 1px solid #eee;
  margin-top: 20px;
  font-size: 1.1em;
  font-weight: bold;
`;

const PromotionSelectionContainer = styled(FormGroup)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;

  select {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: white;
    cursor: pointer;
  }
`;

const AppliedPromotionTag = styled.span`
  background-color: #d4edda;
  color: #155724;
  padding: 8px 12px;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 0.95em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #28a745;

  button {
    background: none;
    border: none;
    color: #155724;
    font-size: 1.2em;
    margin-left: 10px;
    cursor: pointer;
    line-height: 1;
  }
`;

// Helper hook to fetch product list for dropdown
const useProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authToken } = useAuth();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch only necessary fields for product selection
      const queryParams = {
        fields: ["nome", "prezzo_unitario", "quantita_disponibili"],
        sort: ["nome:asc"],
      };
      const queryString = buildQueryStringV5(queryParams);
      const response = await fetch(
        `${STRAPI_BASE_API_URL}/prodottos?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      const data = await response.json();
      setProducts(data.data.map((item) => ({ id: item.id, ...item })));
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetchProducts: fetchProducts };
};

// Main Modal Component
const CreatePurchaseModal = ({ isOpen, onClose, clientId, onSuccess }) => {
  const { authToken } = useAuth(); // Assuming user object has user.id for cod_cliente
  const { clienteData } = useUserAndClienteData();
  const {
    products: availableProducts,
    loading: productsLoading,
    error: productsError,
  } = useProductsList();

  const [lineItems, setLineItems] = useState([
    { productId: "", quantity: 1, originalPrice: 0, discountedPrice: 0 },
  ]);
  const [availableClientPromotions, setAvailableClientPromotions] = useState(
    []
  );
  const [selectedClientPromotionId, setSelectedClientPromotionId] =
    useState(""); // Stores the ID of selected ClientePromozione
  const [appliedPromotion, setAppliedPromotion] = useState(null); // Stores the actual Promotion object
  const [promotionDetails, setPromotionDetails] = useState([]); // Stores dettaglio_promozionis for the applied promo
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect to reset form and fetch client promotions when modal opens
  useEffect(() => {
    if (isOpen) {
      setLineItems([
        { productId: "", quantity: 1, originalPrice: 0, discountedPrice: 0 },
      ]);
      setSelectedClientPromotionId("");
      setAppliedPromotion(null);
      setPromotionDetails([]);
      setError(null);
      fetchClientPromotions(); // Fetch promotions when modal opens
    } else {
      // Reset state when modal closes
      setAvailableClientPromotions([]);
    }
  }, [isOpen, clientId]); // Re-fetch if clientId changes

  // Fetch client's available promotions
  const fetchClientPromotions = useCallback(async () => {
    if (!authToken || !clientId) {
      return;
    }
    setLocalLoading(true);
    setError(null);
    try {
      const clientPromoQueryParams = {
        filters: {
          cliente: { id: { $eq: clientId } },
          data_utilizzo: { $null: true }, // Only fetch unused promotions
        },
        populate: {
          promozione: {
            populate: {
              dettaglio_promozionis: {
                populate: {
                  prodottos: { fields: ["id", "nome", "documentId"] }, // Need product IDs for matching discounts
                },
              },
            },
          },
        },
      };
      const clientPromoQueryString = buildQueryStringV5(clientPromoQueryParams);
      const response = await fetch(
        `${STRAPI_BASE_API_URL}/storico-promozionis?${clientPromoQueryString}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Errore nel recupero delle promozioni disponibili.");
      }
      const data = await response.json();
      const now = new Date();
      // Filter out promotions that are not currently active
      const activePromotions = data.data.filter((cp) => {
        const promo = cp.promozione;
        if (!promo) return false;
        const startDate = new Date(promo.data_inizio);
        const endDate = new Date(promo.data_fine);
        return now >= startDate && now <= endDate;
      });

      setAvailableClientPromotions(activePromotions);
    } catch (err) {
      console.error("Error fetching client promotions:", err);
      setError(
        err.message || "Impossibile caricare le promozioni disponibili."
      );
    } finally {
      setLocalLoading(false);
    }
  }, [authToken, clientId]);

  // Function to validate and apply promotion
  const validateAndApplyPromotion = useCallback(
    (promoIdToApply, currentLineItems) => {
      setError(null); // Clear previous errors

      if (!promoIdToApply) {
        setAppliedPromotion(null);
        setPromotionDetails([]);
        return;
      }

      promoIdToApply = availableClientPromotions.find(
        (promotion) => promotion.documentId === promoIdToApply
      )?.id;

      const selectedClientPromoFull = availableClientPromotions.find(
        (promotion) => promotion.id === Number(promoIdToApply)
      );

      if (selectedClientPromoFull && selectedClientPromoFull.promozione) {
        const promotion = selectedClientPromoFull.promozione;
        const details = promotion.dettaglio_promozionis || [];

        // Check required products for this promotion
        const requiredProductIdsForPromo = details.flatMap((detail) =>
          detail.prodottos ? detail.prodottos.map((p) => p.id) : []
        );

        // Get current product IDs in cart
        const currentProductIdsInCart = currentLineItems
          .filter((item) => item.productId)
          .map((item) => item.productId);

        let canApplyPromotion = true;
        let missingProducts = [];

        if (requiredProductIdsForPromo.length > 0) {
          // If the promotion targets specific products, check if ALL of them are in the cart
          requiredProductIdsForPromo.forEach((requiredId) => {
            if (!currentProductIdsInCart.includes(requiredId)) {
              canApplyPromotion = false;
              const missingProductName =
                availableProducts.find((p) => p.id === requiredId)?.nome ||
                `ID:${requiredId}`;
              missingProducts.push(missingProductName);
            }
          });
        }

        if (!canApplyPromotion) {
          setError(
            `Per applicare la promozione "${
              promotion.titolo
            }", devi includere tutti i seguenti prodotti nel carrello: ${missingProducts.join(
              ", "
            )}.`
          );
          setAppliedPromotion(null);
          setPromotionDetails([]);
          // Do NOT reset selectedClientPromotionId here. Keep the dropdown selection.
        } else {
          setAppliedPromotion(promotion);
          setPromotionDetails(details);
          // Only show success alert if this is a manual selection, not auto-revalidation
          if (selectedClientPromotionId === promoIdToApply) {
            // Check if this was the explicit user selection
            window.alert(
              `Promozione "${promotion.titolo}" applicata con successo!`
            ); // Replace with custom alert
          }
        }
      } else {
        setAppliedPromotion(null);
        setPromotionDetails([]);
        if (promoIdToApply) {
          // Only set error if an ID was actually selected
          setError("Dettagli promozione non trovati o promozione non valida.");
        }
      }
    },
    [availableClientPromotions, availableProducts, selectedClientPromotionId]
  ); // Add selectedClientPromotionId as dependency

  // Recalculate prices and totals when line items or applied promotion change
  useEffect(() => {
    updateLineItemPrices();
    // Also re-validate and apply promotion if a promotion is selected and line items change
    if (selectedClientPromotionId) {
      validateAndApplyPromotion(selectedClientPromotionId, lineItems);
    }
  }, [
    lineItems.map((item) => `${item.productId}-${item.quantity}`).join("-"),
    appliedPromotion, // This dependency keeps the core price logic correct
    availableProducts,
    selectedClientPromotionId, // This triggers price recalc if promo changes
    validateAndApplyPromotion, // Ensure this is stable
  ]);

  const updateLineItemPrices = useCallback(() => {
    setLineItems((prevItems) => {
      return prevItems.map((item) => {
        const product = availableProducts.find((p) => p.id === item.productId);
        if (!product) {
          return { ...item, originalPrice: 0, discountedPrice: 0 };
        }

        let originalPrice = product.prezzo_unitario;
        let discountedPrice = originalPrice;

        if (appliedPromotion && promotionDetails.length > 0) {
          // Iterate through all promotion details to find applicable ones
          // Promotions can be general (no prodottos linked) or product-specific
          const applicableDetails = promotionDetails.filter(
            (detail) =>
              !detail.prodottos ||
              detail.prodottos.length === 0 || // General promotion applies if no specific products are linked
              detail.prodottos.some((p) => p.id === product.id) // Product-specific promotion
          );

          // Apply discounts. If multiple applicable details, a common strategy is to apply them sequentially
          // or pick the best one. For simplicity, we'll apply them in order.
          applicableDetails.forEach((detail) => {
            const { tipo_applicazione, valore } = detail;
            if (tipo_applicazione === "percentuale") {
              discountedPrice = discountedPrice * (1 - valore / 100);
            } else if (tipo_applicazione === "fisso") {
              discountedPrice = discountedPrice - valore;
            }
          });
          discountedPrice = Math.max(0, discountedPrice); // Ensure price doesn't go below zero
        }

        return {
          ...item,
          originalPrice: originalPrice,
          discountedPrice: parseFloat(discountedPrice.toFixed(2)), // Ensure float with 2 decimal places
        };
      });
    });
  }, [appliedPromotion, promotionDetails, availableProducts]);

  if (!isOpen) return null;

  const handleLineItemChange = (index, field, value) => {
    const newItems = [...lineItems];
    newItems[index][field] = value;

    // If product changes, update its base price and reset quantity if needed
    if (field === "productId") {
      const selectedProduct = availableProducts.find((p) => p.id === value);
      if (selectedProduct) {
        // Only update originalPrice here, discountedPrice will be handled by useEffect
        newItems[index].originalPrice = selectedProduct.prezzo_unitario;
        // Optionally reset quantity if switching product
        if (newItems[index].quantity > selectedProduct.quantita_disponibili) {
          newItems[index].quantity =
            selectedProduct.quantita_disponibili > 0 ? 1 : 0; // Default to 1 or 0 if none
          window.alert(
            `Quantità per ${selectedProduct.nome} aggiustata a 1 (max ${selectedProduct.quantita_disponibili}).`
          );
        }
      } else {
        newItems[index].originalPrice = 0;
        newItems[index].discountedPrice = 0;
      }
    } else if (field === "quantity") {
      const selectedProduct = availableProducts.find(
        (p) => p.id === newItems[index].productId
      );
      if (selectedProduct && value > selectedProduct.quantita_disponibili) {
        newItems[index].quantity = selectedProduct.quantita_disponibili;
        window.alert(
          `Quantità massima disponibile per ${selectedProduct.nome} è ${selectedProduct.quantita_disponibili}.`
        );
      }
    }
    setLineItems(newItems);
  };

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { productId: "", quantity: 1, originalPrice: 0, discountedPrice: 0 },
    ]);
  };

  const removeLineItem = (index) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalQuantity = lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.discountedPrice,
    0
  );

  const handlePromotionSelectChange = (e) => {
    const selectedId = e.target.value;

    const selectedPromotionDocumentId = availableClientPromotions.find(
      (promotion) => promotion.id === Number(selectedId)
    )?.documentId; // Added optional

    console.log("Promotion id : ", selectedClientPromotionId);
    setSelectedClientPromotionId(selectedPromotionDocumentId);
    
  };

  const handleRemovePromotion = () => {
    setSelectedClientPromotionId("");
    setAppliedPromotion(null);
    setPromotionDetails([]);
    setError(null);
    // Prices will auto-recalculate due to useEffect dependency
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setError(null);
    if (!authToken || !clientId) {
      setError("Autenticazione necessaria o ID cliente mancante.");
      setLocalLoading(false);
      return;
    }

    if (
      lineItems.length === 0 ||
      lineItems.some((item) => !item.productId || item.quantity <= 0)
    ) {
      setError(
        "Aggiungi almeno un prodotto valido con una quantità maggiore di zero."
      );
      setLocalLoading(false);
      return;
    }

    // Validate if products are still in stock before purchase
    for (const item of lineItems) {
      const product = availableProducts.find((p) => p.id === item.productId);
      if (!product || item.quantity > product.quantita_disponibili) {
        setError(
          `Quantità richiesta per ${
            product ? product.nome : "un prodotto non trovato"
          } (${item.quantity}) supera la disponibilità (${
            product ? product.quantita_disponibili : "N/A"
          }).`
        );
        setLocalLoading(false);
        return;
      }
    }

    try {
      const now = new Date();
      const formattedDate = now.toISOString();

      // 1. Create main purchase record
      const purchasePayload = {
        data: {
          data: formattedDate,
          quantita_totale: totalQuantity,
          prezzo_totale: totalPrice,
          cod_cliente: clientId,
        },
      };

      const purchaseResponse = await fetch(`${STRAPI_BASE_API_URL}/acquistos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(purchasePayload),
      });

      if (!purchaseResponse.ok) {
        const errorData = await purchaseResponse.json();
        throw new Error(
          errorData.error?.message ||
            "Errore durante la creazione dell'acquisto."
        );
      }
      const newPurchase = await purchaseResponse.json();
      const newPurchaseId = newPurchase.data.id;

      // 2. Create detail purchase records and update product quantities
      for (const item of lineItems) {
        const product = availableProducts.find((p) => p.id === item.productId);
        if (!product) {
          console.warn(
            `Product with ID ${item.productId} not found during purchase creation.`
          );
          continue;
        }

        const detailPurchasePayload = {
          data: {
            quantita: item.quantity,
            prezzo_unitario_originale: item.originalPrice,
            prezzo_unitario_scontato: item.discountedPrice,
            prodotto: item.productId,
            acquisto: newPurchaseId, // Link to the newly created purchase
            ...(appliedPromotion && { promozione: appliedPromotion.id }), // Link to promotion if applied
          },
        };
        console.log("Detail Purchase : ", detailPurchasePayload.data);
        const detailResponse = await fetch(
          `${STRAPI_BASE_API_URL}/dettaglio-acquistos`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(detailPurchasePayload),
          }
        );

        if (!detailResponse.ok) {
          const errorData = await detailResponse.json();
          console.error(
            `Errore durante la creazione del dettaglio acquisto per prodotto ${item.productId}:`,
            errorData
          );
          // In a real app, you might want to implement rollback for the main purchase if detail fails
        }

        // Update product quantity_disponibili in Strapi
        const newQuantity = product.quantita_disponibili - item.quantity;
        await fetch(`${STRAPI_BASE_API_URL}/prodottos/${product.documentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ data: { quantita_disponibili: newQuantity } }),
        });
      }

      // 3. Mark ClientePromozione as used if a promotion was applied
      if (appliedPromotion && selectedClientPromotionId) {
        // Update the specific ClientePromozione entry
        await fetch(
          `${STRAPI_BASE_API_URL}/storico-promozionis/${selectedClientPromotionId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ data: { data_utilizzo: formattedDate } }),
          }
        );
        window.alert("Promozione segnata come utilizzata!"); // Replace with custom alert
      }

      window.alert("Acquisto completato con successo!"); // Replace with custom alert
      onSuccess(); // Notify parent of success
      onClose(); // Close the modal
    } catch (err) {
      console.error("Errore acquisto:", err);
      setError(err.message || "Si è verificato un errore durante l'acquisto.");
    } finally {
      setLocalLoading(false);
    }
  };

  const isLoading = localLoading || productsLoading;

  // Get IDs of products already selected in other line items
  const selectedProductIds = lineItems
    .map((item) => item.productId)
    .filter(Boolean); // Filter out empty strings/nulls

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Crea Nuovo Acquisto</h2>
          <CloseButton onClick={onClose} disabled={isLoading}>
            &times;
          </CloseButton>
        </ModalHeader>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ModalForm onSubmit={handleSubmit}>
          {lineItems.map((item, index) => (
            <LineItemContainer key={index}>
              {lineItems.length > 1 && (
                <RemoveLineItemButton
                  type="button"
                  onClick={() => removeLineItem(index)}
                  disabled={isLoading}
                >
                  &times;
                </RemoveLineItemButton>
              )}
              <FormGroup>
                <label htmlFor={`product-${index}`}>Prodotto:</label>
                {productsLoading ? (
                  <p>Caricamento prodotti...</p>
                ) : productsError ? (
                  <p style={{ color: "red" }}>
                    Errore caricamento prodotti: {productsError.message}
                  </p>
                ) : (
                  <select
                    id={`product-${index}`}
                    value={item.productId}
                    onChange={(e) =>
                      handleLineItemChange(
                        index,
                        "productId",
                        parseInt(e.target.value, 10)
                      )
                    } // Parse value to int
                    required
                    disabled={isLoading}
                  >
                    <option value="">Seleziona un prodotto</option>
                    {availableProducts.map(
                      (product) =>
                        (!selectedProductIds.includes(product.id) ||
                          product.id === item.productId) && (
                          <option key={product.id} value={product.id}>
                            {product.nome} - €
                            {product.prezzo_unitario.toFixed(2)} (Disp:{" "}
                            {product.quantita_disponibili})
                          </option>
                        )
                      //   <option key={product.id} value={product.id}>
                      //     {product.nome} - €{product.prezzo_unitario.toFixed(2)}{" "}
                      //     (Disp: {product.quantita_disponibili})
                      //   </option>
                    )}
                  </select>
                )}
              </FormGroup>
              <FormGroup>
                <label htmlFor={`quantity-${index}`}>Quantità:</label>
                <input
                  type="number"
                  id={`quantity-${index}`}
                  value={item.quantity}
                  onChange={(e) =>
                    handleLineItemChange(
                      index,
                      "quantity",
                      parseInt(e.target.value, 10)
                    )
                  } // Parse value to int
                  min="1"
                  required
                  disabled={isLoading}
                />
              </FormGroup>
              {item.productId && (
                <p>
                  Prezzo Originale: €
                  {item.originalPrice ? item.originalPrice.toFixed(2) : "0.00"}{" "}
                  | Prezzo Scontato: €
                  {item.discountedPrice
                    ? item.discountedPrice.toFixed(2)
                    : "0.00"}
                </p>
              )}
            </LineItemContainer>
          ))}
          <AddLineItemButton
            type="button"
            onClick={addLineItem}
            disabled={isLoading}
          >
            Aggiungi Prodotto
          </AddLineItemButton>

          {/* Promotion Section */}
          <h3
            style={{
              marginTop: "20px",
              borderTop: "1px solid #eee",
              paddingTop: "20px",
            }}
          >
            Promozione
          </h3>
          {appliedPromotion ? (
            <AppliedPromotionTag>
              Promozione Applicata: {appliedPromotion.titolo} (
              {appliedPromotion.codice})
              <button
                type="button"
                onClick={handleRemovePromotion}
                disabled={isLoading}
              >
                &times;
              </button>
            </AppliedPromotionTag>
          ) : (
            <PromotionSelectionContainer>
              <label htmlFor="clientPromotionSelect">
                Seleziona Promozione:
              </label>
              {localLoading && !availableClientPromotions.length ? (
                <p>Caricamento promozioni...</p>
              ) : error ? (
                <p style={{ color: "red" }}>
                  Errore caricamento promozioni: {error}
                </p>
              ) : (
                <select
                  id="clientPromotionSelect"
                  value={selectedClientPromotionId}
                  onChange={handlePromotionSelectChange}
                  disabled={isLoading}
                >
                  <option value="">Nessuna promozione</option>
                  {availableClientPromotions.map((cp) => (
                    <option key={cp.id} value={cp.id}>
                      {cp.promozione.titolo} - ({cp.promozione.codice})
                    </option>
                  ))}
                </select>
              )}
              {!availableClientPromotions.length && !localLoading && !error && (
                <p>Nessuna promozione disponibile.</p>
              )}
            </PromotionSelectionContainer>
          )}

          <TotalsContainer>
            <span>Quantità Totale:</span>
            <span>{totalQuantity}</span>
          </TotalsContainer>
          <TotalsContainer>
            <span>Prezzo Totale:</span>
            <span>€{totalPrice.toFixed(2)}</span>
          </TotalsContainer>

          <ModalActions>
            <CancelButton type="button" onClick={onClose} disabled={isLoading}>
              Annulla
            </CancelButton>
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? "Processo..." : "Completa Acquisto"}
            </SubmitButton>
          </ModalActions>
        </ModalForm>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreatePurchaseModal;
