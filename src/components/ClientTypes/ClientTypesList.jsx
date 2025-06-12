// src/components/ClientTypes/ClientTypesList.jsx
import React, { useState, useEffect, useRef } from "react"; // Import useEffect and useRef
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

import { Pages, AdminSection } from "../../data/constants";

import useClientTypes from "../../hooks/useClientTypes";

// Accept focusedTypeId as a prop
const ClientTypesList = ({ setActiveSection, focusedTypeId }) => {
  const { clientTypes, loading, error } = useClientTypes();
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState({});
  const rowRefs = useRef({}); // Create a ref to store references to each row

  // Effect to handle focusing and expanding a row when focusedTypeId changes
  useEffect(() => {
    if (focusedTypeId && clientTypes.length > 0) {
      const typeIdNum = parseInt(focusedTypeId, 10);
      if (!isNaN(typeIdNum)) {
        // Expand the row
        setExpandedRows((prev) => ({
          ...prev,
          [typeIdNum]: true,
        }));

        // Scroll to the row
        const rowElement = rowRefs.current[typeIdNum];
        if (rowElement) {
          rowElement.scrollIntoView({ behavior: "smooth", block: "center" });
          // Optionally, add a temporary highlight
          rowElement.classList.add("highlight-row");
          const timer = setTimeout(() => {
            rowElement.classList.remove("highlight-row");
          }, 2000); // Highlight for 2 seconds

          return () => clearTimeout(timer); // Cleanup timeout
        }
      }
    }
  }, [focusedTypeId, clientTypes]); // Depend on focusedTypeId and clientTypes

  const handleNewType = () => {
    alert("Funzione 'Nuova Tipologia' non implementata.");
  };

  const handleSearch = () => {
    alert("Funzione 'Ricerca' non implementata.");
  };

  const handleEdit = (id) => {
    alert(`Modifica tipologia cliente con ID: ${id}`);
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        `Sei sicuro di voler eliminare la tipologia cliente con ID: ${id}?`
      )
    ) {
      alert(`Tipologia cliente con ID: ${id} eliminata (simulato).`);
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [id]: !prevExpandedRows[id],
    }));
  };

  const handlePromotionClick = (promotionDocumentId, event) => {
    event.stopPropagation();
    navigate(`${Pages.PROMOTIONS}/${promotionDocumentId}`);
  };

  const handleClientClick = (clientDocumentId, event) => {
    event.stopPropagation();
    navigate(`${Pages.CLIENT_DETAIL}/${clientDocumentId}`);
  };

  if (loading) {
    return (
      <ClientTypesMessage>Caricamento tipologie cliente...</ClientTypesMessage>
    );
  }

  if (error) {
    return (
      <ClientTypesMessage style={{ color: "red" }}>
        Errore: {error}
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
        <AdminActionButton $secondary onClick={handleSearch}>
          Ricerca
        </AdminActionButton>
        <AdminActionButton onClick={handleNewType}>
          Nuova Tipologia
        </AdminActionButton>
      </AdminSectionControls>

      <AdminSectionTitle>Elenco Tipologie Cliente</AdminSectionTitle>

      {clientTypes.length === 0 ? (
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
              {/* Assign ref to the main row */}
              <ClientTypesTableRow
                ref={(el) => (rowRefs.current[type.id] = el)}
                className={
                  parseInt(focusedTypeId, 10) === type.id ? "highlight-row" : ""
                } // Optional initial highlight
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
                  <div>
                    <ClientTypesActionButton
                      onClick={() => handleEdit(type.id)}
                    >
                      Modifica
                    </ClientTypesActionButton>
                    <ClientTypesActionButton
                      $delete
                      onClick={() => handleDelete(type.id)}
                    >
                      Elimina
                    </ClientTypesActionButton>
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
                              <AssociatedItemAction>
                                Vedi Dettagli
                              </AssociatedItemAction>
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
                              <AssociatedItemAction>
                                Vedi Dettagli
                              </AssociatedItemAction>
                            </AssociatedListItem>
                          ))}
                        </ul>
                      ) : (
                        <NoDetailsMessage>
                          Nessun cliente associato.
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
    </ClientTypesListContainer>
  );
};

export default ClientTypesList;
