// src/components/Admin/ClientList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  AdminSectionControls,
  AdminActionButton,
  AdminSectionTitle,
  AdminHeader,
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

import Expander from "../Expander/Expander";

import { AdminSection, Pages } from "../../data/constants"; // No need for ProfilazioneClientiSubSection here
import { StatsGridContainer } from "../Stats/StyledStatCards";
import useClients from "../../hooks/useClients";
import TotalRegisteredClientsCard from "../Stats/ClientsStats/TotalRegisteredClientsCard";
import NewClientsCountCard from "../Stats/ClientsStats/NewClientsCountCard";
import ReturningClientsPercentageCard from "../Stats/ClientsStats/ReturningClientsPercentageCard";
import AverageCustomerSpendCard from "../Stats/ClientsStats/AverageCustomerSpendCard";
import ClientsByTypeDistributionCard from "../Stats/ClientsStats/ClientsByTypeDistributionCard";
import SalesSeasonalityCard from "../Stats/ProducPromotionStats/SalesSeasonalityCard";


const ClientList = ({ setActiveSection }) => {
  // Keep setActiveSection as a prop
  const [searchTerm, setSearchTerm] = useState("");
  const [finalSearchTerm, setFinalSearchTermn] = useState("");
  const { clients, loading, error, refetchClients } =
    useClients(finalSearchTerm);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleNewClient = () => {
    alert("Funzione 'Nuovo Cliente' non implementata.");
  };

  const handleSearchClick = () => {
    setFinalSearchTermn(searchTerm);
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
      return date.toLocaleDateString("it-IT");
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Data non valida";
    }
  };

  // New handler for clicking on an associated client type
  const handleAssociatedTypeClick = (typeId, event) => {
    event.stopPropagation(); // Prevent row expansion if applicable
    // Navigate to the TipologieCliente section with the specific typeId
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
        {/* Search input and button */}
        <input
          type="text"
          placeholder="Cerca cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: `1px solid ${Colors.lightBorder}`,
          }}
        />
        <AdminActionButton $secondary onClick={handleSearchClick}>
          Ricerca
        </AdminActionButton>
        <AdminActionButton
          $secondary
          onClick={() => {
            setSearchTerm("");
            setFinalSearchTermn("");
          }}
        >
          Resetta Ricerca
        </AdminActionButton>
        {/* <AdminActionButton onClick={handleNewClient}>
          Nuovo Cliente
        </AdminActionButton> */}
      </AdminSectionControls>

      <AdminSectionTitle>Elenco Clienti</AdminSectionTitle>

      {clients.length === 0 ? (
        <ClientTypesMessage>
          Nessun cliente disponibile per la ricerca corrente.
        </ClientTypesMessage>
      ) : (
        <ClientTypesTable
          style={{
            gridTemplateColumns:
              "2fr 1fr 1fr 1.2fr 2fr 1fr 0.5fr 1fr 1.2fr 2fr 1.5fr",
          }}
        >
          {/* Table Headers - 10 columns now */}
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
          {/* New Column */}
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
              {/* New Tipologie Cliente Cell with Expander */}
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
                            onClick={(e) =>
                              handleAssociatedTypeClick(type.id, e)
                            } // Call new handler
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
