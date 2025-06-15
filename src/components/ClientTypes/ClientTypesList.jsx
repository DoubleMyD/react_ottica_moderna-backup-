// src/components/ClientTypes/ClientTypesList.jsx
import React, { useState, useEffect, useRef, useMemo } from "react"; // Import useMemo
import { useNavigate } from "react-router-dom";
import {
  AdminSectionControls,
  AdminActionButton,
  AdminSectionTitle,
} from "../../styles/StyledAdminDashboard";
import {
  ClientTypesListContainer,
  ClientTypesTable,
  ClientTypesTableHeaderCell,
  ClientTypesTableRow,
  ClientTypesTableCell,
  ClientTypesActionButton,
  ClientTypesMessage,
  DetailsSection,
  NoDetailsMessage,
  AssociatedListItem,
  AssociatedItemContent,
  AssociatedItemTitle,
  AssociatedItemDetails,
  AssociatedItemAction,
} from "../ClientTypes/StyledClientTypesList";
import { Colors } from "../../styles/colors";
import styled from "styled-components"; // Import styled for new filter components

import Expander from "../Expander/Expander";

import { Pages, AdminSection } from "../../data/constants";

import useClientTypes from "../../hooks/useClientTypes"; // Updated hook
import useProduct from "../../hooks/useProducts"; // NEW: Import useProducts to populate product filter dropdown

import ClientTypeFormModal from "./ClientTypeFormModal";
import EditClientTypeButton from "./EditClientTypeButton";
import DeleteClientTypeButton from "./DeleteClientTypeButton";

import { STRAPI_BASE_URL } from "../../data/api"; // Corrected import for image URL prefix
import { ProductImage } from "../ElencoProdotti/StyledElencoProdotti"; // For product images in expanded details

// Styled Components for Filter UI
const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: ${Colors.lightBackground};
  border-radius: 10px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap; /* Allow wrapping on smaller screens */

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 10px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap; /* Allow wrapping for label/input groups */
  flex-grow: 1; /* Allow filter groups to take available space */
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: ${Colors.darkText};
  font-size: 0.95em;
  white-space: nowrap; /* Prevent label from wrapping */
`;

const FilterInput = styled.input`
  padding: 10px 12px;
  border: 1px solid ${Colors.lightBorder};
  border-radius: 6px;
  font-size: 1rem;
  color: ${Colors.darkText};
  background-color: ${Colors.offWhite};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  flex-grow: 1; /* Allow input to take available space */
  min-width: 150px; /* Ensure input is not too small */

  &:focus {
    border-color: ${Colors.primaryBlue};
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    outline: none;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid ${Colors.lightBorder};
  border-radius: 6px;
  font-size: 1rem;
  color: ${Colors.darkText};
  background-color: ${Colors.offWhite};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  flex-grow: 1; /* Allow select to take available space */
  min-width: 150px; /* Ensure select is not too small */

  &:focus {
    border-color: ${Colors.primaryBlue};
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    outline: none;
  }
`;

const FilterButton = styled(AdminActionButton)`
  flex-shrink: 0;
  padding: 10px 20px;
`;

const ClientTypesList = ({ setActiveSection, focusedTypeId }) => {
  const navigate = useNavigate();
  const rowRefs = useRef({});

  // Input states (reflect what the user is typing/selecting)
  const [searchTermInput, setSearchTermInput] = useState("");
  const [selectedProductFilterInput, setSelectedProductFilterInput] =
    useState(""); // Stores productDocumentId

  // Committed states (used by the hook, updated only on button click)
  const [committedSearchTerm, setCommittedSearchTerm] = useState("");
  const [committedProductFilter, setCommittedProductFilter] = useState("");

  // Memoize filterOptions object to prevent unnecessary re-renders of useClientTypes
  const filterOptions = useMemo(
    () => ({
      searchTerm: committedSearchTerm,
      productDocumentId: committedProductFilter,
    }),
    [committedSearchTerm, committedProductFilter]
  );

  // Pass filterOptions to the hook
  const {
    clientTypes,
    loading,
    error,
    fetchClientTypes,
  } = useClientTypes(filterOptions);

  // Fetch all products to populate the filter dropdown
  const {
    products: availableProducts,
    loading: productsLoading,
    error: productsError,
  } = useProduct({});

  // State for the create client type modal
  const [isCreateClientTypeModalOpen, setIsCreateClientTypeModalOpen] =
    useState(false);
  const [expandedRows, setExpandedRows] = useState({}); // Defined here

  useEffect(() => {
    if (focusedTypeId && clientTypes.length > 0) {
      const typeIdNum = parseInt(focusedTypeId, 10);
      const typeToFocus = clientTypes.find(
        (type) => type.id === typeIdNum || type.documentId === focusedTypeId
      );

      if (typeToFocus) {
        setExpandedRows((prev) => ({
          ...prev,
          [typeToFocus.id]: true,
        }));

        const rowElement = rowRefs.current[typeToFocus.id];
        if (rowElement) {
          rowElement.scrollIntoView({ behavior: "smooth", block: "center" });
          rowElement.classList.add("highlight-row");
          const timer = setTimeout(() => {
            rowElement.classList.remove("highlight-row");
          }, 2000);

          return () => clearTimeout(timer);
        }
      }
    }
  }, [focusedTypeId, clientTypes]);

  // Define toggleRow function
  const toggleRow = (id) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [id]: !prevExpandedRows[id],
    }));
  };

  const handleNewType = () => {
    setIsCreateClientTypeModalOpen(true);
  };

  const handleClientTypeFormSuccess = () => {
    setIsCreateClientTypeModalOpen(false);
    fetchClientTypes(); // Refresh the list after create/update/delete
  };

  const handleApplyFilters = () => {
    // Update committed states, which will trigger refetch in useClientTypes
    setCommittedSearchTerm(searchTermInput);
    setCommittedProductFilter(selectedProductFilterInput);
    fetchClientTypes();
  };

  const handleResetFilters = () => {
    // Reset both input and committed states
    setSearchTermInput("");
    setSelectedProductFilterInput("");
    setCommittedSearchTerm("");
    setCommittedProductFilter("");
  };

  const handlePromotionClick = (promotionDocumentId, event) => {
    event.stopPropagation();
    navigate(`${Pages.PROMOTION_DETAIL}/${promotionDocumentId}`);
  };

  const handleClientClick = (clientDocumentId, event) => {
    event.stopPropagation();
    navigate(`${Pages.CLIENT_DETAIL}/${clientDocumentId}`);
  };

  const handleProductClick = (productDocumentId, event) => {
    event.stopPropagation();
    navigate(`${Pages.CATALOG}/${productDocumentId}`);
  };

  if (loading || productsLoading) {
    // Check both loadings
    return (
      <ClientTypesMessage>
        Caricamento tipologie cliente e prodotti...
      </ClientTypesMessage>
    );
  }

  if (error || productsError) {
    // Check both errors
    return (
      <ClientTypesMessage style={{ color: "red" }}>
        Errore: {error || productsError}
      </ClientTypesMessage>
    );
  }

  return (
    <ClientTypesListContainer>
      <AdminSectionControls>
        <AdminActionButton
          $secondary
          onClick={() =>
            setActiveSection(AdminSection.Profilazione_ElencoClienti)
          }
        >
          Elenco Clienti
        </AdminActionButton>
        <AdminActionButton
          onClick={() =>
            setActiveSection(AdminSection.Profilazione_TipologieCliente)
          }
        >
          Tipologie Cliente
        </AdminActionButton>
        <AdminActionButton onClick={handleNewType}>
          Nuova Tipologia
        </AdminActionButton>
      </AdminSectionControls>

      <AdminSectionTitle>Elenco Tipologie Cliente</AdminSectionTitle>

      {/* Filter Section */}
      <FilterContainer>
        <FilterGroup>
          <FilterLabel htmlFor="searchTermInput">Cerca:</FilterLabel>
          <FilterInput
            type="text"
            id="searchTermInput"
            placeholder="Nome, Descrizione, Tratti Caratteristici..."
            value={searchTermInput}
            onChange={(e) => setSearchTermInput(e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="productFilterInput">
            Prodotto Associato:
          </FilterLabel>
          <FilterSelect
            id="productFilterInput"
            value={selectedProductFilterInput}
            onChange={(e) => setSelectedProductFilterInput(e.target.value)}
          >
            <option value="">Tutti i Prodotti</option>
            {availableProducts.map((product) => (
              <option key={product.documentId} value={product.documentId}>
                {product.nome}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterButton onClick={handleApplyFilters}>Applica Filtri</FilterButton>
        <FilterButton $secondary onClick={handleResetFilters}>
          Resetta Filtri
        </FilterButton>
      </FilterContainer>

      {clientTypes.length === 0 &&
      (committedSearchTerm || committedProductFilter) ? (
        <ClientTypesMessage>
          Nessuna tipologia cliente trovata con i filtri applicati.
        </ClientTypesMessage>
      ) : clientTypes.length === 0 ? (
        <ClientTypesMessage>
          Nessuna tipologia cliente disponibile.
        </ClientTypesMessage>
      ) : (
        <ClientTypesTable>
          <ClientTypesTableHeaderCell>ID</ClientTypesTableHeaderCell>
          <ClientTypesTableHeaderCell>Nome</ClientTypesTableHeaderCell>
          <ClientTypesTableHeaderCell>Descrizione</ClientTypesTableHeaderCell>
          <ClientTypesTableHeaderCell>
            Tratti Caratteristici
          </ClientTypesTableHeaderCell>
          <ClientTypesTableHeaderCell>Azioni</ClientTypesTableHeaderCell>
          <ClientTypesTableHeaderCell>Dettagli</ClientTypesTableHeaderCell>

          {clientTypes.map((type) => (
            
            <React.Fragment key={type.id}>
              <ClientTypesTableRow
                ref={(el) => (rowRefs.current[type.id] = el)}
                className={
                  focusedTypeId &&
                  (parseInt(focusedTypeId, 10) === type.id ||
                    type.documentId === focusedTypeId)
                    ? "highlight-row"
                    : ""
                }
              >
                <ClientTypesTableCell data-label="ID">
                  {type.id}
                </ClientTypesTableCell>
                <ClientTypesTableCell data-label="Nome">
                  {type.nome}
                </ClientTypesTableCell>
                <ClientTypesTableCell data-label="Descrizione">
                  {type.descrizione}
                </ClientTypesTableCell>
                <ClientTypesTableCell data-label="Tratti Caratteristici">
                  {type.tratti_caratteristici}
                </ClientTypesTableCell>
                <ClientTypesTableCell>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <EditClientTypeButton
                      clientType={type}
                      onEditSuccess={handleClientTypeFormSuccess}
                    />
                    <DeleteClientTypeButton
                      clientType={type}
                      onDeleteSuccess={handleClientTypeFormSuccess}
                    />
                  </div>
                </ClientTypesTableCell>
                <ClientTypesTableCell>
                  <ClientTypesActionButton onClick={() => toggleRow(type.id)}>
                    {expandedRows[type.id]
                      ? "Nascondi Dettagli ▲"
                      : "Mostra Dettagli ▼"}
                  </ClientTypesActionButton>
                </ClientTypesTableCell>
              </ClientTypesTableRow>

              {expandedRows[type.id] && (
                <ClientTypesTableRow style={{ gridColumn: "1 / -1" }}>
                  <ClientTypesTableCell
                    data-label="Dettagli Estesi"
                    style={{
                      padding: "20px",
                      border: "none",
                      backgroundColor: "#f9f9f9",
                      gridColumn: "1 / -1",
                    }}
                  >
                    <DetailsSection>
                      <h4>Promozioni Associate:</h4>
                      {type.promoziones && type.promoziones.length > 0 ? (
                        <ul>
                          {type.promoziones.map((promo) => (
                            <AssociatedListItem
                              key={promo.id}
                              onClick={(e) =>
                                handlePromotionClick(promo.documentId, e)
                              }
                            >
                              <AssociatedItemContent>
                                <AssociatedItemTitle>
                                  {promo.titolo}
                                </AssociatedItemTitle>
                                <AssociatedItemDetails>
                                  {promo.descrizione?.substring(0, 70)}
                                  {promo.descrizione?.length > 70 ? "..." : ""}
                                </AssociatedItemDetails>
                              </AssociatedItemContent>
                            </AssociatedListItem>
                          ))}
                        </ul>
                      ) : (
                        <NoDetailsMessage>
                          Nessuna promozione associata.
                        </NoDetailsMessage>
                      )}
                    </DetailsSection>
                    <DetailsSection>
                      <h4>Clienti Associati:</h4>
                      {type.clientes && type.clientes.length > 0 ? (
                        <ul>
                          {type.clientes.map((client) => (
                            <AssociatedListItem
                              key={client.id}
                              onClick={(e) =>
                                handleClientClick(client.documentId, e)
                              }
                            >
                              <AssociatedItemContent>
                                <AssociatedItemTitle>
                                  {client.nome} {client.cognome}
                                </AssociatedItemTitle>
                                <AssociatedItemDetails>
                                  {client.email}
                                </AssociatedItemDetails>
                              </AssociatedItemContent>
                            </AssociatedListItem>
                          ))}
                        </ul>
                      ) : (
                        <NoDetailsMessage>
                          Nessun cliente associato.
                        </NoDetailsMessage>
                      )}
                    </DetailsSection>
                    <DetailsSection>
                      <h4>Prodotti Associati:</h4>
                      {type.prodottos && type.prodottos.length > 0 ? (
                        <ul>
                          {type.prodottos.map((product) => (
                            <AssociatedListItem
                              key={product.id}
                              onClick={(e) =>
                                handleProductClick(product.documentId, e)
                              }
                            >
                              {product.immagine?.url && (
                                <ProductImage
                                  src={`${STRAPI_BASE_URL}${product.immagine.url}`}
                                  alt={product.nome}
                                  style={{
                                    width: "150px",
                                    height: "150px",
                                    borderRadius: "4px",
                                    marginRight: "8px",
                                    objectFit: "cover",
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://placehold.co/40x40/cccccc/000000?text=IMG";
                                  }}
                                />
                              )}
                              <AssociatedItemContent>
                                <AssociatedItemTitle>
                                  {product.nome}
                                </AssociatedItemTitle>
                                <AssociatedItemDetails>
                                  Prezzo: €
                                  {product.prezzo_unitario?.toFixed(2) ||
                                    "N.D."}
                                </AssociatedItemDetails>
                              </AssociatedItemContent>
                            </AssociatedListItem>
                          ))}
                        </ul>
                      ) : (
                        <NoDetailsMessage>
                          Nessun prodotto associato.
                        </NoDetailsMessage>
                      )}
                    </DetailsSection>
                  </ClientTypesTableCell>
                </ClientTypesTableRow>
              )}
            </React.Fragment>
          ))}
        </ClientTypesTable>
      )}

      {isCreateClientTypeModalOpen && (
        <ClientTypeFormModal
          isOpen={isCreateClientTypeModalOpen}
          onClose={() => setIsCreateClientTypeModalOpen(false)}
          onSuccess={handleClientTypeFormSuccess}
          initialData={null}
        />
      )}
    </ClientTypesListContainer>
  );
};

export default ClientTypesList;
