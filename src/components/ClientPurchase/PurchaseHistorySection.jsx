import React from "react";
import PurchaseItem from "./PurchaseItem"; // Import the single item component
import usePurchaseHistory from "../../hooks/usePurchaseHistory"; // Import the new hook
import {
  HistoryContainer,
  HistorySectionTitle,
  PurchaseList,
} from "./StyledClientPurchaseHistory"; // Import section styles
import {
  Loader,
  ErrorMessage,
  ProfileButton,
} from "../../styles/StyledProfileComponents"; // Assuming these are common UI components

const PurchaseHistorySection = () => {
  const { purchases, loading, error, refetchPurchases } = usePurchaseHistory();

  if (loading) {
    return (
      <HistoryContainer>
        <HistorySectionTitle>Storico Acquisti</HistorySectionTitle>
        <Loader>Caricamento storico acquisti...</Loader>
      </HistoryContainer>
    );
  }

  if (error) {
    return (
      <HistoryContainer>
        <HistorySectionTitle>Storico Acquisti</HistorySectionTitle>
        <ErrorMessage>
          Errore durante il caricamento dello storico acquisti: {error.message}
        </ErrorMessage>
        <ProfileButton onClick={refetchPurchases}>Riprova</ProfileButton>
      </HistoryContainer>
    );
  }

  // **CRITICAL CHECK: Ensure purchases is an array before trying to access .length**
  // This handles cases where purchases might be undefined or not an array for some reason.
  // Although with the fix in usePurchaseHistory, it should always be an array.
  if (!Array.isArray(purchases) || purchases.length === 0) {
    return (
      <HistoryContainer>
        <HistorySectionTitle>Storico Acquisti</HistorySectionTitle>
        <p>Non hai ancora effettuato nessun acquisto.</p>
      </HistoryContainer>
    );
  }

  // console.log(purchases.length); // You can keep this log, it should now show a number

  return (
    <HistoryContainer>
      <HistorySectionTitle>Storico Acquisti</HistorySectionTitle>
      {/* purchases is an array of { id: ..., attributes: { ... } } */}
      {/* No need for the purchases.length > 0 check here, as it's handled above */}
      <PurchaseList>
        {/* Map over the fetched purchases. Pass purchase.attributes to PurchaseItem. */}
        {purchases.map((purchase) => (
          // Use purchase.id for the key as it's unique and stable
          <PurchaseItem key={purchase.id} purchase={purchase} />
        ))}
      </PurchaseList>
    </HistoryContainer>
  );
};

export default PurchaseHistorySection;