// src/components/CompleteProfile.js (or wherever your component is)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/authContext"; // Re-import useAuth
import useUserAndClienteData from "../hooks/useUserAndClienteData"; // Re-import the hook

import {
  ProfileFormContainer,
  ProfileForm,
  ProfileLabel,
  ProfileInput,
  ProfileButton,
  ProfileTitle,
  ErrorMessage,
  Loader,
} from "../styles/StyledProfileComponents";
import { Pages } from "../data/constants";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { authToken } = useAuth(); // Get authToken from AuthContext

  // Destructure all relevant states and functions from your hook
  const {
    userData: fetchedUserData, // Data about the authenticated user (including populated cliente)
    clienteData, // Data about the associated client profile (directly from user.cliente)
    loading: isHooksLoading, // Loading state from the hook's initial fetch
    error: hooksError, // Error state from the hook's initial fetch
    refetch: refetchClienteData, // Method to manually refetch data from the hook
    updateClienteProfile, // Method to create/update client profile via the hook
  } = useUserAndClienteData(); // This hook will fetch data on mount

  // --- Form states ---
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    data_nascita: "",
    nazionalita: "",
    indirizzo: "",
    cap: "",
    citta: "",
    iscrizione_newsletter: false,
  });

  const [formError, setFormError] = useState(null); // Error specific to form submission
  const [formLoading, setFormLoading] = useState(false); // Loading specific to form submission
  const [showRetryButton, setShowRetryButton] = useState(false); // For form submission errors

  // === Effect to handle redirection if NOT AUTHENTICATED ===
  // This remains immediate, as a user without a token should not see this page.
  useEffect(() => {
    if (!authToken) {
      console.error("Auth token not found. Redirecting to login.");
      navigate(Pages.LOGIN);
    }
  }, [authToken, navigate]);

  // === Effect to pre-fill form data when client data is loaded from the hook ===
  useEffect(() => {
    // Only pre-fill if data is loaded by the hook and clienteData is available
    if (!isHooksLoading && clienteData && clienteData.attributes) {
      setFormData({
        nome: clienteData.attributes.nome || "",
        cognome: clienteData.attributes.cognome || "",
        data_nascita: clienteData.attributes.data_nascita || "",
        nazionalita: clienteData.attributes.nazionalita || "",
        indirizzo: clienteData.attributes.indirizzo || "",
        cap: clienteData.attributes.cap || "",
        citta: clienteData.attributes.citta || "",
        iscrizione_newsletter:
          clienteData.attributes.iscrizione_newsletter || false,
      });
    }
  }, [isHooksLoading, clienteData]); // Depend on hook's loading state and clienteData

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetFormState = () => {
    setFormError(null);
    setFormLoading(false);
    setShowRetryButton(false);
  };

  // === handleSubmit: Session/User data validation primarily happens here before calling the hook's update ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormLoading(true); // Start local loading state for form submission
    setFormError(null);
    setShowRetryButton(false);

    // --- Critical validation before making the API request via the hook ---
    // These checks ensure the user has a valid session and their core user data is available
    if (!authToken) {
      setFormError(
        "Sessione scaduta o non autenticata. Effettua nuovamente il login."
      );
      setFormLoading(false);
      setShowRetryButton(true);
      navigate(Pages.LOGIN); // Redirect immediately if token missing at submission time
      return;
    }

    if (!fetchedUserData || !fetchedUserData.id) {
      setFormError(
        "Impossibile recuperare i dati del tuo utente. Ricarica la pagina o riprova ad effettuare il login."
      );
      setFormLoading(false);
      setShowRetryButton(true);
      // Optionally, you could call refetchClienteData() here to attempt a refresh
      // refetchClienteData();
      return;
    }
    // --- End of critical validation ---

    try {
      // Use the hook's updateClienteProfile method.
      // The hook internally handles the logic of POST vs PUT based on clienteDocumentId it holds,
      // and links the new client to userData.id if creating.
      const clientePayload = {
        ...formData,
        // Ensure cap is parsed to integer if it's not empty, otherwise null or undefined
        cap: formData.cap !== "" ? parseInt(formData.cap, 10) : null,
      };

      const result = await updateClienteProfile(clientePayload);

      if (result.success) {
        console.log(
          "Profilo cliente creato/aggiornato con successo:",
          result.data
        );
        navigate(Pages.CLIENT_DASHBOARD); // Redirect to the client dashboard
      } else {
        console.error(
          "Errore durante l'aggiornamento del profilo:",
          result.error
        );
        setFormError(
          `Errore durante l'aggiornamento del profilo: ${result.error}`
        );
        setShowRetryButton(true);
      }
    } catch (err) {
      console.error("An unexpected error occurred during submit:", err);
      setFormError(
        `Si è verificato un errore inaspettato durante l'aggiornamento. Riprova.`
      );
      setShowRetryButton(true);
    } finally {
      setFormLoading(false); // Stop local loading state regardless of success/failure
    }
  };

  // --- Render logic ---
  // The form is always rendered (after the initial authToken check).
  // Visual feedback for loading and errors from the hook's initial fetch is displayed.
  const isFormDisabled =
    formLoading || showRetryButton || isHooksLoading || !!hooksError;

  return (
    <ProfileFormContainer>
      <ProfileTitle>
        Completa la registrazione, inserisci i tuoi dati.
      </ProfileTitle>

      {/* Display loader if the hook is still fetching initial data */}
      {isHooksLoading && <Loader>Caricamento dati profilo...</Loader>}

      {/* Display error from hook's initial fetch, only if not loading */}
      {hooksError && !isHooksLoading && (
        <>
          <ErrorMessage>
            Errore nel caricamento iniziale del profilo:{" "}
            {hooksError.message || "Errore sconosciuto"}.
          </ErrorMessage>
          <ProfileButton type="button" onClick={refetchClienteData}>
            Riprova Caricamento Dati
          </ProfileButton>
        </>
      )}

      {/* Main form, potentially disabled based on loading/error states */}
      <ProfileForm onSubmit={handleSubmit}>
        {formError && <ErrorMessage>{formError}</ErrorMessage>}{" "}
        {formLoading && <Loader>Aggiornamento profilo...</Loader>}{" "}
        {showRetryButton && (
          <ProfileButton type="button" onClick={resetFormState}>
            Riprova
          </ProfileButton>
        )}
        <ProfileLabel>Nome</ProfileLabel>
        <ProfileInput
          type="text"
          name="nome"
          placeholder="Nome"
          value={formData.nome}
          onChange={handleChange}
          required
          disabled={isFormDisabled}
        />
        <ProfileLabel>Cognome</ProfileLabel>
        <ProfileInput
          type="text"
          name="cognome"
          placeholder="Cognome"
          value={formData.cognome}
          onChange={handleChange}
          required
          disabled={isFormDisabled}
        />
        <ProfileLabel>Data di nascita</ProfileLabel>
        <ProfileInput
          type="date"
          name="data_nascita"
          placeholder="Data di Nascita"
          value={formData.data_nascita}
          onChange={handleChange}
          required
          disabled={isFormDisabled}
        />
        <ProfileLabel>Nazionalità</ProfileLabel>
        <ProfileInput
          type="text"
          name="nazionalita"
          placeholder="Nazionalità"
          value={formData.nazionalita}
          onChange={handleChange}
          required
          disabled={isFormDisabled}
        />
        <ProfileLabel>Indirizzo</ProfileLabel>
        <ProfileInput
          type="text"
          name="indirizzo"
          placeholder="Indirizzo"
          value={formData.indirizzo}
          onChange={handleChange}
          required
          disabled={isFormDisabled}
        />
        <ProfileLabel>CAP</ProfileLabel>
        <ProfileInput
          type="text"
          name="cap"
          placeholder="CAP"
          value={formData.cap}
          onChange={handleChange}
          required
          disabled={isFormDisabled}
        />
        <ProfileLabel>Città</ProfileLabel>
        <ProfileInput
          type="text"
          name="citta"
          placeholder="Città"
          value={formData.citta}
          onChange={handleChange}
          required
          disabled={isFormDisabled}
        />
        <ProfileLabel>
          <input
            type="checkbox"
            name="iscrizione_newsletter"
            checked={formData.iscrizione_newsletter}
            onChange={handleChange}
            disabled={isFormDisabled}
          />
          Ricevi notizie via email
        </ProfileLabel>
        <ProfileButton type="submit" disabled={isFormDisabled}>
          Completa Profilo
        </ProfileButton>
      </ProfileForm>
    </ProfileFormContainer>
  );
};

export default CompleteProfile;
