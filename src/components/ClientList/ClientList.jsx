// src/components/Admin/ClientList.jsx
import React, { useState, useEffect, useRef, useMemo } from "react"; // NEW: Import useMemo
import { useNavigate } from "react-router-dom";
import {
  AdminSectionControls,
  AdminActionButton,
  AdminSectionTitle,
  // AdminHeader, // Not directly used in ClientList, likely from a parent component
} from "../../styles/StyledAdminDashboard";
import {
  ClientTypesListContainer,
  ClientTypesTable,
  ClientTypesTableHeaderCell,
  ClientTypesTableRow,
  ClientTypesTableCell,
  ClientTypesMessage,
  DetailsSection,
  AssociatedListItem,
  AssociatedItemContent,
  AssociatedItemTitle,
  AssociatedItemDetails,
  NoDetailsMessage,
} from "../ClientTypes/StyledClientTypesList";
import { Colors } from "../../styles/colors";
import styled from "styled-components"; // Import styled for filter components

import Expander from "../Expander/Expander";

import { AdminSection, Pages } from "../../data/constants";
import { StatsGridContainer } from "../Stats/StyledStatCards";
import useClients from "../../hooks/useClients"; // Updated hook
import useClientTypes from "../../hooks/useClientTypes"; // NEW: Import useClientTypes for filter dropdown

import TotalRegisteredClientsCard from "../Stats/ClientsStats/TotalRegisteredClientsCard";
import NewClientsCountCard from "../Stats/ClientsStats/NewClientsCountCard";
import ReturningClientsPercentageCard from "../Stats/ClientsStats/ReturningClientsPercentageCard";
import AverageCustomerSpendCard from "../Stats/ClientsStats/AverageCustomerSpendCard";
import ClientsByTypeDistributionCard from "../Stats/ClientsStats/ClientsByTypeDistributionCard";
import SalesSeasonalityCard from "../Stats/ProducPromotionStats/SalesSeasonalityCard";

// Styled Components for Filter UI (can be moved to a shared styles file if preferred)
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
  /* Custom style for filter buttons, inherits from AdminActionButton */
  flex-shrink: 0; /* Prevent button from shrinking */
  padding: 10px 20px;
`;

const ClientList = ({ setActiveSection }) => {
  const navigate = useNavigate();
  const rowRefs = useRef({}); // Not explicitly used for row expansion, but good to keep if needed

  // Input states (reflect what the user is typing/selecting)
  const [searchTermInput, setSearchTermInput] = useState("");
  const [selectedClientTypeFilterInput, setSelectedClientTypeFilterInput] =
    useState("");

  // Committed states (used by the hook, updated only on button click)
  const [committedSearchTerm, setCommittedSearchTerm] = useState("");
  const [committedClientTypeFilter, setCommittedClientTypeFilter] =
    useState("");

  // Memoize filterOptions object to prevent unnecessary re-renders of useClients
  const filterOptions = useMemo(
    () => ({
      searchTerm: committedSearchTerm,
      clientType: committedClientTypeFilter,
    }),
    [committedSearchTerm, committedClientTypeFilter]
  );

  // Fetch clients with committed filters
  const { clients, loading, error, refetchClients } = useClients(filterOptions);

  // Fetch all client types to populate the filter dropdown
  const {
    clientTypes: availableClientTypes,
    loading: clientTypesLoading,
    error: clientTypesError,
  } = useClientTypes();

  const handleNewClient = () => {
    alert("Funzione 'Nuovo Cliente' non implementata.");
  };

  const handleApplyFilters = () => {
    // Update committed states, which will trigger refetch in useClients
    setCommittedSearchTerm(searchTermInput);
    setCommittedClientTypeFilter(selectedClientTypeFilterInput);
  };

  const handleResetFilters = () => {
    // Reset both input and committed states
    setSearchTermInput("");
    setSelectedClientTypeFilterInput("");
    setCommittedSearchTerm("");
    setCommittedClientTypeFilter("");
  };

  const handleClientClick = (clientDocumentId, event) => {
    event.stopPropagation();
    navigate(`${Pages.CLIENT_DETAIL}/${clientDocumentId}`);
  };

  const formatItalianDate = (dateString) => {
    if (!dateString) return "N.D.";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Data non valida";
      }
      return new Date(date).toLocaleDateString("it-IT"); // Ensure Date object is used
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Data non valida";
    }
  };

  const handleAssociatedTypeClick = (typeId, event) => {
    event.stopPropagation();
    navigate(
      `?section=${AdminSection.Profilazione_TipologieCliente}&typeId=${typeId}`
    );
  };

  if (loading) {
    return <ClientTypesMessage>Caricamento clienti...</ClientTypesMessage>;
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
      <StatsGridContainer>
        <TotalRegisteredClientsCard />
        <NewClientsCountCard />
        <ReturningClientsPercentageCard />
        <AverageCustomerSpendCard />
        <SalesSeasonalityCard />
        <ClientsByTypeDistributionCard />
      </StatsGridContainer>

      <AdminSectionControls>
        <AdminActionButton
          onClick={() =>
            setActiveSection(AdminSection.Profilazione_ElencoClienti)
          }
        >
          Elenco Clienti
        </AdminActionButton>
        <AdminActionButton
          $secondary
          onClick={() =>
            setActiveSection(AdminSection.Profilazione_TipologieCliente)
          }
        >
          Tipologie Cliente
        </AdminActionButton>
        {/* Nuovo Cliente button, uncomment if needed */}
        {/* <AdminActionButton onClick={handleNewClient}>
          Nuovo Cliente
        </AdminActionButton> */}
      </AdminSectionControls>

      <AdminSectionTitle>Elenco Clienti</AdminSectionTitle>

      {/* Filter Section */}
      <FilterContainer>
        <FilterGroup>
          <FilterLabel htmlFor="searchTermInput">Cerca:</FilterLabel>
          <FilterInput
            type="text"
            id="searchTermInput"
            placeholder="Nome, Cognome, Email..."
            value={searchTermInput}
            onChange={(e) => setSearchTermInput(e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="clientTypeFilterInput">
            Tipologia Cliente:
          </FilterLabel>
          {clientTypesLoading ? (
            <FilterSelect id="clientTypeFilterInput" value="" disabled>
              <option value="">Caricamento...</option>
            </FilterSelect>
          ) : clientTypesError ? (
            <FilterSelect id="clientTypeFilterInput" value="" disabled>
              <option value="">Errore caricamento tipologie</option>
            </FilterSelect>
          ) : (
            <FilterSelect
              id="clientTypeFilterInput"
              value={selectedClientTypeFilterInput}
              onChange={(e) => setSelectedClientTypeFilterInput(e.target.value)}
            >
              <option value="">Tutte le Tipologie</option>
              {availableClientTypes.map((type) => (
                <option key={type.id} value={type.nome}>
                  {type.nome}
                </option>
              ))}
            </FilterSelect>
          )}
        </FilterGroup>

        <FilterButton onClick={handleApplyFilters}>Applica Filtri</FilterButton>
        <FilterButton $secondary onClick={handleResetFilters}>
          Resetta Filtri
        </FilterButton>
      </FilterContainer>

      {clients.length === 0 &&
      (committedSearchTerm || committedClientTypeFilter) ? (
        <ClientTypesMessage>
          Nessun cliente trovato con i filtri applicati.
        </ClientTypesMessage>
      ) : clients.length === 0 ? (
        <ClientTypesMessage>Nessun cliente disponibile.</ClientTypesMessage>
      ) : (
        <ClientTypesTable
          style={{
            gridTemplateColumns:
              "2fr 1fr 1fr 1.2fr 2fr 1fr 0.5fr 1fr 1.2fr 2fr 1.5fr",
          }}
        >
          {/* Table Headers */}
          <ClientTypesTableHeaderCell>Email</ClientTypesTableHeaderCell>
          <ClientTypesTableHeaderCell>Nome</ClientTypesTableHeaderCell>
          <ClientTypesTableHeaderCell>Cognome</ClientTypesTableHeaderCell>
          <ClientTypesTableHeaderCell>
            Data di Nascita
          </ClientTypesTableHeaderCell>
          <ClientTypesTableHeaderCell>Indirizzo</ClientTypesTableHeaderCell>
          <ClientTypesTableHeaderCell>Città</ClientTypesTableHeaderCell>
          <ClientTypesTableHeaderCell>CAP</ClientTypesTableHeaderCell>
          <ClientTypesTableHeaderCell>Nazionalità</ClientTypesTableHeaderCell>
          <ClientTypesTableHeaderCell>
            Iscrizione Newsletter
          </ClientTypesTableHeaderCell>
          <ClientTypesTableHeaderCell>
            Tipologie Cliente
          </ClientTypesTableHeaderCell>
          <ClientTypesTableHeaderCell></ClientTypesTableHeaderCell>{" "}
          {/* Client Rows */}
          {clients.map((client) => (
            <ClientTypesTableRow key={client.id}>
              <ClientTypesTableCell data-label="Email">
                {client.user?.email || "N.D."}
              </ClientTypesTableCell>
              <ClientTypesTableCell data-label="Nome">
                {client.nome || "N.D."}
              </ClientTypesTableCell>
              <ClientTypesTableCell data-label="Cognome">
                {client.cognome || "N.D."}
              </ClientTypesTableCell>
              <ClientTypesTableCell data-label="Data di Nascita">
                {formatItalianDate(client.data_nascita)}
              </ClientTypesTableCell>
              <ClientTypesTableCell data-label="Indirizzo">
                {client.indirizzo || "N.D."}
              </ClientTypesTableCell>
              <ClientTypesTableCell data-label="Città">
                {client.citta || "N.D."}
              </ClientTypesTableCell>
              <ClientTypesTableCell data-label="CAP">
                {client.cap || "N.D."}
              </ClientTypesTableCell>
              <ClientTypesTableCell data-label="Nazionalità">
                {client.nazionalita || "N.D."}
              </ClientTypesTableCell>
              <ClientTypesTableCell data-label="Iscrizione Newsletter">
                {typeof client.iscrizione_newsletter === "boolean"
                  ? client.iscrizione_newsletter
                    ? "Sì"
                    : "No"
                  : "N.D."}
              </ClientTypesTableCell>
              <ClientTypesTableCell data-label="Tipologie Cliente">
                {client.tipologia_clientes &&
                client.tipologia_clientes.length > 0 ? (
                  <Expander
                    label={`${client.tipologia_clientes.length} Tipologie`}
                  >
                    <DetailsSection>
                      <ul>
                        {client.tipologia_clientes.map((type) => (
                          <AssociatedListItem
                            key={type.id}
                            onClick={
                              (e) =>
                                handleAssociatedTypeClick(type.documentId, e) // Use documentId for navigation
                            }
                          >
                            <AssociatedItemContent>
                              <AssociatedItemTitle>
                                {type.nome}
                              </AssociatedItemTitle>
                              <AssociatedItemDetails>
                                ID: {type.id}
                              </AssociatedItemDetails>
                            </AssociatedItemContent>
                          </AssociatedListItem>
                        ))}
                      </ul>
                    </DetailsSection>
                  </Expander>
                ) : (
                  <NoDetailsMessage>
                    Nessuna tipologia associata.
                  </NoDetailsMessage>
                )}
              </ClientTypesTableCell>
              <ClientTypesTableCell data-label="Azione">
                <AdminActionButton
                  onClick={(e) => handleClientClick(client.documentId, e)}
                >
                  Vedi Dettagli
                </AdminActionButton>
              </ClientTypesTableCell>
            </ClientTypesTableRow>
          ))}
        </ClientTypesTable>
      )}
    </ClientTypesListContainer>
  );
};

export default ClientList;
