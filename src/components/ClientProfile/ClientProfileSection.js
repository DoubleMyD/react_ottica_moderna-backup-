// src/components/ClientProfileSection/ClientProfileSection.jsx
import React, { useState, useEffect } from "react";
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
} from "./StyledClientProfile";
import { dummyClientProfile } from "../../data/test/dummyClientProfile"; 

const ClientProfileSection = () => {
  const [formData, setFormData] = useState(dummyClientProfile);
  const [originalData, setOriginalData] = useState(dummyClientProfile);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = () => {
    setOriginalData(formData);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Check if the newsletter subscription is being changed from true to false
    const isUnsubscribing =
      originalData.newsletterSubscription === true &&
      formData.newsletterSubscription === false;

    if (isUnsubscribing) {
      const confirmUnsubscribe = window.confirm(
        "Sei sicuro di voler disabilitare l'iscrizione alla newsletter? Non riceverai più promozioni e aggiornamenti sul nostro negozio."
      );

      if (!confirmUnsubscribe) {
        // If the user clicks "Cancel" on the confirmation dialog,
        // revert the newsletter checkbox state in formData and stop the save process.
        setFormData((prevData) => ({
          ...prevData,
          newsletterSubscription: true, // Revert to true (subscribed)
        }));
        // Do NOT set isEditing to false immediately, allow user to change other fields
        // or re-attempt saving if they want to.
        return; // Exit the function, preventing save
      }
    }

    // Proceed with saving if not unsubscribing, or if unsubscription was confirmed
    console.log("Saving changes:", formData);
    // In a real application, you would send `formData` to your backend here.
    // e.g., await api.updateClientProfile(formData);

    // Simulate API call success:
    setIsEditing(false); // Exit editing mode
    setOriginalData(formData); // Update original data to the newly saved data
  };

  const handleCancel = () => {
    setFormData(originalData); // Revert all form data to original state
    setIsEditing(false); // Exit editing mode
  };

  return (
    <ProfileContainer>
      <ProfileSectionTitle>Dati Anagrafici Cliente</ProfileSectionTitle>
      <ProfileContentWrapper>
        <FormSection>
          <FormGrid>
            {/* ... (all your form fields - Email, Nazionalità, Nome, Città, Cognome, CAP, Data Nascita, Indirizzo) */}

            <FormFieldGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </FormFieldGroup>

            <FormFieldGroup>
              <Label htmlFor="nationality">Nazionalità</Label>
              <Input
                type="text"
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </FormFieldGroup>

            <FormFieldGroup>
              <Label htmlFor="name">Nome</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </FormFieldGroup>

            <FormFieldGroup>
              <Label htmlFor="city">Città</Label>
              <Input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </FormFieldGroup>

            <FormFieldGroup>
              <Label htmlFor="surname">Cognome</Label>
              <Input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </FormFieldGroup>

            <FormFieldGroup>
              <Label htmlFor="postalCode">CAP</Label>
              <Input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </FormFieldGroup>

            <FormFieldGroup>
              <Label htmlFor="dateOfBirth">Data Nascita</Label>
              <Input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </FormFieldGroup>

            <FormFieldGroup>
              <Label htmlFor="address">Indirizzo</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </FormFieldGroup>
          </FormGrid>
        </FormSection>

        <ControlsSection>
          <ButtonGroup>
            {isEditing ? (
              <>
                <ProfileButton onClick={handleSave}>Salva</ProfileButton>
                <ProfileButton onClick={handleCancel} className="cancel">
                  Annulla
                </ProfileButton>
              </>
            ) : (
              <ProfileButton onClick={handleEdit}>Modifica</ProfileButton>
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
              disabled={!isEditing}
            />
          </NewsletterToggleGroup>
        </ControlsSection>
      </ProfileContentWrapper>
    </ProfileContainer>
  );
};

export default ClientProfileSection;