import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ProfileFormContainer,
  ProfileForm,
  ProfileLabel,
  ProfileInput,
  ProfileButton,
  ProfileTitle,
  ErrorMessage, // Import the new ErrorMessage component
  Loader, // Import the new Loader component
} from "../styles/StyledProfileComponents"; // Ensure these are imported from your styled components file
import { STRAPI_BASE_URL } from "../data/api";
import { Pages } from "../data/constants";

const CompleteProfile = () => {
  const [userData, setUserData] = useState({
    nome: "",
    cognome: "",
    data_nascita: "",
    indirizzo: "",
    cap: "",
    citta: "",
    iscrizione_newsletter: false,
  });

  const [error, setError] = useState(null); // New state for errors
  const [loading, setLoading] = useState(false); // New state for loading
  const [showReloadButton, setShowReloadButton] = useState(false); // New state for reload button

  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  // Check if the token is available
  if (!token) {
    console.error("Token not found. Please log in first.");
    // Optionally redirect to login page if token is missing
    // navigate('/login');
    return null; // Or render a message indicating missing token
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Function to reset the form and error states
  const resetFormState = () => {
    setError(null);
    setLoading(false);
    setShowReloadButton(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Start loading
    setError(null); // Clear previous errors
    setShowReloadButton(false); // Hide reload button

    // AbortController for timeout
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    try {
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      // 1. Fetch user ID
      const meRes = await fetch(`${STRAPI_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal, // Apply timeout to this fetch
      });

      // Check if the first fetch was successful
      if (!meRes.ok) {
        const errorData = await meRes.json();
        console.error("Error fetching user ID:", errorData);
        setError(
          `Errore nel recupero ID utente: ${
            errorData.error?.message || meRes.statusText
          }`
        );
        setShowReloadButton(true);
        throw new Error(`HTTP error fetching user ID! status: ${meRes.status}`);
      }
      const meData = await meRes.json();

      if (!meData?.id) {
        setError("ID utente non trovato dopo il recupero.");
        setShowReloadButton(true);
        throw new Error("User ID not found");
      }
      const userId = meData.id;

      // 2. Update the user data
      const response = await fetch(`${STRAPI_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
        signal: controller.signal, // Apply timeout to this fetch as well
      });

      const updatedUserData = await response.json();

      if (response.ok) {
        console.log("User data updated successfully:", updatedUserData);
        navigate(Pages.CLIENT_DASHBOARD); // Redirect to the client dashboard after successful update
      } else {
        // Handle specific API errors from Strapi
        const errorDetail =
          updatedUserData.error?.message ||
          updatedUserData.message ||
          `Status: ${response.status}`;
        console.error("Error updating user data:", updatedUserData);
        setError(`Errore durante l'aggiornamento: ${errorDetail}`);
        setShowReloadButton(true);
        throw new Error(
          `HTTP error updating user data! status: ${response.status}`
        );
      }
    } catch (error) {
      if (error.name === "AbortError") {
        setError(
          "Il server non ha risposto in tempo. Controlla la tua connessione o riprova."
        );
        setShowReloadButton(true);
      } else {
        console.error("Error during user data update:", error);
        // Only set a generic error if a specific one wasn't set earlier
        if (!error) {
          // If error wasn't set by specific HTTP checks
          setError(
            "Si è verificato un errore inaspettato durante l'aggiornamento. Riprova."
          );
          setShowReloadButton(true);
        }
      }
    } finally {
      setLoading(false); // Stop loading regardless of outcome
      clearTimeout(id); // Ensure timeout is cleared
    }
  };

  return (
    <ProfileFormContainer>
      <ProfileTitle>
        Completa la registrazione, inserisci i tuoi dati.
      </ProfileTitle>
      <ProfileForm onSubmit={handleSubmit}>
        {/* Error message display */}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* Loading indicator */}
        {loading && <Loader>Aggiornamento profilo...</Loader>}

        {/* Reload/Reset button */}
        {showReloadButton && (
          <ProfileButton type="button" onClick={resetFormState}>
            Riprova
          </ProfileButton>
        )}

        <ProfileLabel>Nome</ProfileLabel>
        <ProfileInput
          type="text"
          name="nome"
          placeholder="Nome"
          value={userData.nome}
          onChange={handleChange}
          required
          disabled={loading || showReloadButton} // Disable when loading or showing reload
        />
        <ProfileLabel>Cognome</ProfileLabel>
        <ProfileInput
          type="text"
          name="cognome"
          placeholder="Cognome"
          value={userData.cognome}
          onChange={handleChange}
          required
          disabled={loading || showReloadButton}
        />

        <ProfileLabel>Data di nascita</ProfileLabel>
        <ProfileInput
          type="date"
          name="data_nascita"
          placeholder="Data di Nascita"
          value={userData.data_nascita}
          onChange={handleChange}
          required
          disabled={loading || showReloadButton}
        />

        <ProfileLabel>Indirizzo</ProfileLabel>
        <ProfileInput
          type="text"
          name="indirizzo"
          placeholder="Indirizzo"
          value={userData.indirizzo}
          onChange={handleChange}
          required
          disabled={loading || showReloadButton}
        />

        <ProfileLabel>CAP</ProfileLabel>
        <ProfileInput
          type="text"
          name="cap"
          placeholder="CAP"
          value={userData.cap}
          onChange={handleChange}
          required
          disabled={loading || showReloadButton}
        />

        <ProfileLabel>Città</ProfileLabel>
        <ProfileInput
          type="text"
          name="citta"
          placeholder="Città"
          value={userData.citta}
          onChange={handleChange}
          required
          disabled={loading || showReloadButton}
        />

        <ProfileLabel>
          <input
            type="checkbox"
            name="iscrizione_newsletter"
            checked={userData.iscrizione_newsletter}
            onChange={handleChange}
            disabled={loading || showReloadButton}
          />
          Ricevi notizie via email
        </ProfileLabel>

        <ProfileButton type="submit" disabled={loading || showReloadButton}>
          Completa Profilo
        </ProfileButton>
      </ProfileForm>
    </ProfileFormContainer>
  );
};

export default CompleteProfile;
