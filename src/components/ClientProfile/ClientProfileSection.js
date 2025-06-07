// src/components/ClientProfileSection/ClientProfileSection.jsx
import React, { useState, useEffect, useCallback } from "react";
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
  const [localError, setLocalError] = useState(null); // This state holds the warning message
  const [isSaving, setIsSaving] = useState(false);

  // === START ADDITION ===
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);
  // === END ADDITION ===

  const mapStrapiDataToFormData = useCallback((clientObj, userObj) => {
    // === START MODIFICATION ===
    // If clientObj has an 'attributes' property, use it. Otherwise, assume clientObj itself contains the attributes.
    const clientAttributes = clientObj?.attributes || clientObj || {};
    // === END MODIFICATION ===

    const userAttributes = userObj || {};

    return {
      email: userAttributes.email || "",
      username: userAttributes.username || "",
      nationality: clientAttributes.nazione || "",
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

  useEffect(() => {
    if (userData || clienteData) {
      const mapped = mapStrapiDataToFormData(clienteData, userData);
      setFormData(mapped);
      setOriginalData(mapped);
      if (!clienteData) {
        setIsEditing(true);
        // Set the message when no client data is found
        setLocalError(
          "Nessun profilo cliente trovato. Completa il modulo per crearne uno."
        );
      } else {
        setIsEditing(false);
        // Clear this specific error if client data exists
        setLocalError(null);
      }
    }
  }, [userData, clienteData, mapStrapiDataToFormData]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    // Removed setLocalError(null) here. The useEffect handles the error state based on clienteData.
  }, []);

  const handleSave = useCallback(async () => {
    setLocalError(null); // Clear local errors on save attempt
    setIsSaving(true);

    if (!formData.name || !formData.surname) {
      setLocalError("Nome e Cognome sono campi obbligatori.");
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
      cap: parseInt(formData.postalCode, 10),
      citta: formData.city,
      nazione: formData.nationality,
      iscrizione_newsletter: formData.newsletterSubscription,
    };

    const { success, error: apiError } = await updateClienteProfile(
      updatesToSend
    );

    if (success) {
      setIsEditing(false);
      alert("Profilo aggiornato con successo!");
      // The useEffect will re-run after updateClienteProfile causes a refetch
      // and will clear localError if clienteData is now present.
    } else {
      setLocalError(apiError || "Errore sconosciuto durante il salvataggio.");
    }
    setIsSaving(false);
  }, [formData, originalData, updateClienteProfile]);

  const handleCancel = useCallback(() => {
    setFormData(originalData);
    setIsEditing(false);
    setIsSaving(false);

    // Re-evaluate the local error for "no profile found"
    // This ensures the message reappears if the profile is still not present
    if (!clienteData) {
      setLocalError(
        "Nessun profilo cliente trovato. Completa il modulo per crearne uno."
      );
    } else {
      // If clienteData exists, clear any local error.
      setLocalError(null);
    }
  }, [originalData, clienteData]); // Added clienteData to dependencies

  const combinedLoading = loading || isSaving;

  if (loading && !userData) {
    return (
      <ProfileContainer>
        <Loader>Caricamento profilo...</Loader>
      </ProfileContainer>
    );
  }

  if (error && !userData) {
    return (
      <ProfileContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <ProfileButton onClick={refetch}>Riprova</ProfileButton>
      </ProfileContainer>
    );
  }

  if (!formData.email && !loading) {
    return (
      <ProfileContainer>
        <ErrorMessage>
          Impossibile caricare i dati del profilo. Riprova.
        </ErrorMessage>
        <ProfileButton onClick={refetch}>Riprova</ProfileButton>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileSectionTitle>Dati Anagrafici Cliente</ProfileSectionTitle>
      <ProfileContentWrapper>
        {(error || localError) && ( // Display either the global error or the local one
          <ErrorMessage>{error || localError}</ErrorMessage>
        )}
        {combinedLoading && !error && <Loader>Operazione in corso...</Loader>}

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
    </ProfileContainer>
  );
};

export default ClientProfileSection;
