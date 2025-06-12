// src/pages/ClientDetailPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useClientDetail from "../hooks/useClientDetail";

// Import core layout styles
import {
  ClientDetailContainer,
  BackArrowButton,
  ClientMainContent,
  PlaceholderText,
} from "../styles/StyledClientDetailPage";

// Import section components
import ClientHeaderSection from "../components/ClientDetail/ClientHeaderSection/ClientHeaderSection";
import ClientPurchasesSection from "../components/ClientDetail/ClientPurchasesSection/ClientPurchasesSection";
import ClientPromotionsSection from "../components/ClientDetail/ClientPromotionsSection/ClientPromotionsSection";
import { AdminSection, Pages } from "../data/constants";
import usePurchaseHistory from "../hooks/usePurchaseHistory";

const ClientDetailPage = () => {
  const { documentId: clientDocumentId } = useParams(); // Get the client DocumentId from the URL
  const navigate = useNavigate();

  // Only fetch core client data here
  const {
    client,
    loading: clientLoading,
    error: clientError,
  } = useClientDetail(clientDocumentId);

  const {allTimeSpent} = usePurchaseHistory(client?.id);

  const handleGoBack = () => {
    navigate(-1);
  };

  // New handler for clicking on an associated client type
  const handleAssociatedTypeClick = (typeId, event) => {
    event.stopPropagation(); // Prevent row expansion if applicable
    // Navigate to the TipologieCliente section with the specific typeId
    navigate(
      `${Pages.ADMIN}?section=${AdminSection.Profilazione_TipologieCliente}&typeId=${typeId}`
    );
  };

  // Only handle loading/error for the core client data in this component
  if (clientLoading) {
    return (
      <ClientDetailContainer>
        <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>
        <PlaceholderText>Caricamento dati cliente...</PlaceholderText>
      </ClientDetailContainer>
    );
  }

  if (clientError) {
    return (
      <ClientDetailContainer>
        <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>
        <PlaceholderText style={{ color: "red" }}>
          Errore nel caricamento del cliente: {clientError}
        </PlaceholderText>
      </ClientDetailContainer>
    );
  }

  if (!client) {
    return (
      <ClientDetailContainer>
        <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>
        <PlaceholderText>Cliente non trovato.</PlaceholderText>
      </ClientDetailContainer>
    );
  }

  // Destructure attributes for ClientHeaderSection
  const { tipologia_clientes, ...clientCoreAttributes } = client;

  // Prepare client types data for ClientHeaderSection
  const clientTypesData =
    tipologia_clientes?.map((item) => ({
      id: item.id,
      nome: item.nome,
      descrizione: item.descrizione,
    })) || [];

  return (
    <ClientDetailContainer>
      <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>

      {/* Header Section: Displays core client data and client types */}
      <ClientHeaderSection
        clientAttributes={clientCoreAttributes}
        clientTypes={clientTypesData}
        allTimeSpent={allTimeSpent}
        onTipologyClick={handleAssociatedTypeClick}
      />

      <ClientMainContent>
        {/* Purchases Section: Fetches its own data based on client.id */}
        <ClientPurchasesSection clientId={client.id} />

        {/* Promotions Section: Fetches its own data based on client.id */}
        <ClientPromotionsSection clientId={client.id} />
      </ClientMainContent>
    </ClientDetailContainer>
  );
};

export default ClientDetailPage;
