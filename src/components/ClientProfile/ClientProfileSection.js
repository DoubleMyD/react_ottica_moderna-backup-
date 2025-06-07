// src/components/ClientProfileSection/ClientProfileSection.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import useUserAndClienteData from "../../data/useUserAndClienteData";
import {
  ProfileContainer,
  ProfileSectionTitle,
  FormGrid,
  FormFieldGroup,
  Label,
  Input,
  ButtonGroup,
  ProfileButton,
  NewsletterToggleGroup,
  NewsletterLabel,
  Checkbox,
  ProfileContentWrapper,
  FormSection,
  ControlsSection,
  ErrorMessage,
  Loader,
} from "./StyledClientProfile";

const ClientProfileSection = () => {
  const {
    userData,
    clienteData,
    loading,
    error,
    updateClienteProfile,
    refetch,
  } = useUserAndClienteData();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    nationality: "",
    name: "",
    city: "",
    surname: "",
    postalCode: "",
    dateOfBirth: "",
    address: "",
    newsletterSubscription: false,
  });

  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [localError, setLocalError] = useState(null); // For client-side errors and data-related messages
  const [isSaving, setIsSaving] = useState(false);

  const [showApiError, setShowApiError] = useState(false);
  const apiErrorTimerRef = useRef(null);

  // Effect for delaying API error display (errors from useUserAndClienteData hook)
  useEffect(() => {
    if (error) {
      apiErrorTimerRef.current = setTimeout(() => {
        setShowApiError(true);
      }, 1000); // 1000ms delay for displaying the error
    } else {
      if (apiErrorTimerRef.current) {
        clearTimeout(apiErrorTimerRef.current);
      }
      setShowApiError(false);
    }

    return () => {
      if (apiErrorTimerRef.current) {
        clearTimeout(apiErrorTimerRef.current);
      }
    };
  }, [error]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const mapStrapiDataToFormData = useCallback((clientObj, userObj) => {
    const clientAttributes = clientObj?.attributes || clientObj || {};
    const userAttributes = userObj || {};

    return {
      email: userAttributes.email || "",
      username: userAttributes.username || "",
      nationality: clientAttributes.nazionalita || "",
      name: clientAttributes.nome || "",
      city: clientAttributes.citta || "",
      surname: clientAttributes.cognome || "",
      postalCode: clientAttributes.cap ? String(clientAttributes.cap) : "",
      dateOfBirth: clientAttributes.data_nascita
        ? clientAttributes.data_nascita.split("T")[0]
        : "",
      address: clientAttributes.indirizzo || "",
      newsletterSubscription: clientAttributes.iscrizione_newsletter || false,
    };
  }, []);

  // Effect to manage form data, editing state, and data-related local errors (like "no profile" or "essential data missing")
  useEffect(() => {
    // Phase 1: While still loading, ensure any local errors related to data absence are not set.
    // This prevents flashes during initial data fetch.
    if (loading) {
      if (
        localError ===
          "Nessun profilo cliente trovato. Completa il modulo per crearne uno." ||
        localError === "Impossibile caricare i dati essenziali del profilo."
      ) {
        setLocalError(null); // Clear it if it was set prematurely
      }
      return; // Exit early if still loading
    }

    // Phase 2: Loading is complete. Now, set form data and determine profile status.
    if (userData) {
      const mapped = mapStrapiDataToFormData(clienteData, userData);

      // Check if essential user data (like email) is missing *after* mapping
      if (!mapped.email) {
        setLocalError("Impossibile caricare i dati essenziali del profilo.");
        setIsEditing(false); // Cannot edit if essential user data is missing
        setFormData(mapped); // Still set what could be mapped (e.g., username)
        setOriginalData(mapped);
        return; // Exit early as essential data is problematic
      }

      setFormData(mapped);
      setOriginalData(mapped);

      // If we made it here, essential user data is present. Now check client profile.
      if (!clienteData) {
        // Confirmed: loading complete, userData exists, but no client profile data found.
        setIsEditing(true); // Allow user to create profile
        setLocalError(
          "Nessun profilo cliente trovato. Completa il modulo per crearne uno."
        );
      } else {
        // All good: client data exists
        setIsEditing(false);
        setLocalError(null); // Clear any previous local errors if data is now present
      }
    } else {
      // Fallback: userData is missing even after loading is complete (a critical issue)
      // This means authentication or user data fetch failed fundamentally.
      setLocalError("Impossibile caricare i dati essenziali del profilo.");
      setIsEditing(false);
      // Clear form fields if essential user data cannot be loaded
      setFormData({
        email: "",
        username: "",
        nationality: "",
        name: "",
        city: "",
        surname: "",
        postalCode: "",
        dateOfBirth: "",
        address: "",
        newsletterSubscription: false,
      });
      setOriginalData({});
    }
  }, [userData, clienteData, mapStrapiDataToFormData, loading, localError]); // Added localError to dependency array

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(async () => {
    setLocalError(null); // Clear any existing local errors on save attempt
    setIsSaving(true);

    if (!formData.name || !formData.surname) {
      setLocalError("Nome e Cognome sono campi obbligatori."); // This local error is immediate
      setIsSaving(false);
      return;
    }

    const isUnsubscribing =
      originalData.newsletterSubscription === true &&
      formData.newsletterSubscription === false;

    if (isUnsubscribing) {
      const confirmUnsubscribe = window.confirm(
        "Sei sicuro di voler disabilitare l'iscrizione alla newsletter? Non riceverai più promozioni e aggiornamenti sul nostro negozio."
      );

      if (!confirmUnsubscribe) {
        setFormData((prevData) => ({
          ...prevData,
          newsletterSubscription: true,
        }));
        setIsSaving(false);
        return;
      }
    }

    const updatesToSend = {
      nome: formData.name,
      cognome: formData.surname,
      data_nascita: formData.dateOfBirth,
      indirizzo: formData.address,
      cap: formData.postalCode ? parseInt(formData.postalCode, 10) : null,
      citta: formData.city,
      nazionalita: formData.nationality,
      iscrizione_newsletter: formData.newsletterSubscription,
    };

    const { success, error: apiError } = await updateClienteProfile(
      updatesToSend
    );

    if (success) {
      setIsEditing(false);
      alert("Profilo aggiornato con successo!");
    } else {
      // If there's an API error during save, set it to localError for immediate display
      setLocalError(apiError || "Errore sconosciuto durante il salvataggio.");
    }
    setIsSaving(false);
  }, [formData, originalData, updateClienteProfile]);

  const handleCancel = useCallback(() => {
    setFormData(originalData); // Revert to original data on cancel
    setIsEditing(false);
    setIsSaving(false);

    // After canceling, re-evaluate if client data exists or not
    if (!clienteData) {
      setLocalError(
        "Nessun profilo cliente trovato. Completa il modulo per crearne uno."
      );
    } else {
      setLocalError(null);
    }
  }, [originalData, clienteData]);

  const combinedLoading = loading || isSaving;

  // Primary loading state: show loader if data is being initially fetched for user OR client
  // This covers the initial fetch of both userData and clienteData.
  if (loading && (!userData || !clienteData)) {
    return (
      <ProfileContainer>
        <Loader>Caricamento profilo...</Loader>
      </ProfileContainer>
    );
  }

  // --- Removed the problematic 'if (!formData.email && ...)' block from here ---

  return (
    <ProfileContainer>
      <ProfileSectionTitle>Dati Anagrafici Cliente</ProfileSectionTitle>
      <ProfileContentWrapper>
        {/* Display API error (delayed via showApiError) OR local validation/data-related errors (immediate) */}
        {((showApiError && error) || localError) && (
          <ErrorMessage>{(showApiError && error) || localError}</ErrorMessage>
        )}
        {/* Show generic loading spinner for ongoing operations, but hide if an error message is currently visible */}
        {combinedLoading && !((showApiError && error) || localError) && (
          <Loader>Operazione in corso...</Loader>
        )}

        <FormSection>
          <FormGrid>
            <FormFieldGroup>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username || ""}
                readOnly
                disabled={true}
              />
            </FormFieldGroup>

            <FormFieldGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email || ""}
                readOnly
                disabled={true}
              />
            </FormFieldGroup>

            <FormFieldGroup>
              <Label htmlFor="name">Nome</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                readOnly={!isEditing || combinedLoading}
                disabled={!isEditing || combinedLoading}
              />
            </FormFieldGroup>

            <FormFieldGroup>
              <Label htmlFor="surname">Cognome</Label>
              <Input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname || ""}
                onChange={handleChange}
                readOnly={!isEditing || combinedLoading}
                disabled={!isEditing || combinedLoading}
              />
            </FormFieldGroup>

            <FormFieldGroup>
              <Label htmlFor="nationality">Nazionalità</Label>
              <Input
                type="text"
                id="nationality"
                name="nationality"
                value={formData.nationality || ""}
                onChange={handleChange}
                readOnly={!isEditing || combinedLoading}
                disabled={!isEditing || combinedLoading}
              />
            </FormFieldGroup>

            <FormFieldGroup>
              <Label htmlFor="city">Città</Label>
              <Input
                type="text"
                id="city"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                readOnly={!isEditing || combinedLoading}
                disabled={!isEditing || combinedLoading}
              />
            </FormFieldGroup>

            <FormFieldGroup>
              <Label htmlFor="postalCode">CAP</Label>
              <Input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode || ""}
                onChange={handleChange}
                readOnly={!isEditing || combinedLoading}
                disabled={!isEditing || combinedLoading}
              />
            </FormFieldGroup>

            <FormFieldGroup>
              <Label htmlFor="dateOfBirth">Data Nascita</Label>
              <Input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth || ""}
                onChange={handleChange}
                readOnly={!isEditing || combinedLoading}
                disabled={!isEditing || combinedLoading}
              />
            </FormFieldGroup>

            <FormFieldGroup>
              <Label htmlFor="address">Indirizzo</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                readOnly={!isEditing || combinedLoading}
                disabled={!isEditing || combinedLoading}
              />
            </FormFieldGroup>
          </FormGrid>
        </FormSection>

        <ControlsSection>
          <ButtonGroup>
            {isEditing ? (
              <>
                <ProfileButton onClick={handleSave} disabled={combinedLoading}>
                  Salva
                </ProfileButton>
                <ProfileButton
                  onClick={handleCancel}
                  className="cancel"
                  disabled={combinedLoading}
                >
                  Annulla
                </ProfileButton>
              </>
            ) : (
              <ProfileButton onClick={handleEdit} disabled={combinedLoading}>
                Modifica
              </ProfileButton>
            )}
          </ButtonGroup>

          <NewsletterToggleGroup>
            <NewsletterLabel htmlFor="newsletterSubscription">
              Iscrizione Newsletter
            </NewsletterLabel>
            <Checkbox
              id="newsletterSubscription"
              name="newsletterSubscription"
              checked={formData.newsletterSubscription}
              onChange={handleChange}
              disabled={!isEditing || combinedLoading}
            />
          </NewsletterToggleGroup>
        </ControlsSection>
      </ProfileContentWrapper>
      {/* Display a "Riprova" button if an API error is shown */}
      {showApiError && error && (
        <ProfileButton onClick={refetch} style={{ marginTop: "10px" }}>
          Riprova
        </ProfileButton>
      )}
    </ProfileContainer>
  );
};

export default ClientProfileSection;
