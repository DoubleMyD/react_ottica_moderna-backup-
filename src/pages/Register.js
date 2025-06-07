import React, { useState } from "react";
import { useAuth } from "../data/authContext";
import {
  RegisterContainer,
  RegisterForm,
  RegisterTitle,
  RegisterLabel,
  RegisterInput,
  RegisterButton,
  ErrorMessage, // Assuming you have this styled component for errors
  Loader, // Assuming you have this styled component for loading
} from "../styles/StyledRegisterComponents";

import { useNavigate } from "react-router-dom";
import { STRAPI_BASE_URL } from "../data/api"; 
import { Pages, Role } from "../data/constants";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null); // State to check if there is an error
  const [loading, setLoading] = useState(false); // State to handle loading state
  const [showReloadButton, setShowReloadButton] = useState(false); // New state for reload button

  const navigate = useNavigate();
  const { login } = useAuth(); // Assuming you have a useAuth hook for authentication

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
    setLoading(true); // Set loading to true
    setError(null); // Reset error
    setShowReloadButton(false); // Hide reload button initially

    const controller = new AbortController(); // Create an AbortController
    const id = setTimeout(() => controller.abort(), 10000); // Set timeout for 10 seconds

    try {
      const response = await fetch(`${STRAPI_BASE_URL}/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
        signal: controller.signal, // Pass the abort signal
      });

      clearTimeout(id); // Clear the timeout if fetch completes before 10s

      if (!response.ok) {
        if (response.status === 400) {
          // Strapi often returns 400 for existing users/emails
          const errorData = await response.json();
          if (errorData && errorData.error && errorData.error.message) {
            setError(`Registrazione fallita: ${errorData.error.message}`);
          } else {
            setError(
              "Registrazione fallita: Credenziali non valide o utente già esistente."
            );
          }
        } else {
          setError(
            `Errore del server: ${response.status}. Impossibile registrarsi.`
          );
        }
        setShowReloadButton(true); // Show reload button for server errors
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      login(data.jwt, Role.CLIENT); // Assuming login function takes JWT and role

      console.log("Registration successful:", data);
      navigate(Pages.COMPLETE_PROFILE); // Redirect to complete profile page
    } catch (error) {
      if (error.name === "AbortError") {
        setError(
          "Il server non ha risposto in tempo. Controlla la tua connessione o riprova."
        );
        setShowReloadButton(true); // Show reload button on timeout
      } else {
        console.error("Error during registration:", error);
        setError(
          "Si è verificato un errore inaspettato durante la registrazione. Riprova."
        );
        setShowReloadButton(true); // Show reload button for other unexpected errors
      }
    } finally {
      setLoading(false); // Stop loading
      clearTimeout(id); // Ensure timeout is cleared in all cases
    }
  };

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSubmit}>
        <RegisterTitle>Ottica Moderna - Registrazione</RegisterTitle>

        {/* Error Message Display */}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* Loading Indicator */}
        {loading && <Loader>Registrazione in corso...</Loader>}

        {/* Reload/Reset Button */}
        {showReloadButton && (
          <RegisterButton type="button" onClick={resetFormState}>
            Riprova
          </RegisterButton>
        )}

        <RegisterLabel>Username</RegisterLabel>
        <RegisterInput
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={loading || showReloadButton} // Disable inputs
        />

        <RegisterLabel>Email</RegisterLabel>
        <RegisterInput
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading || showReloadButton} // Disable inputs
        />

        <RegisterLabel>Password</RegisterLabel>
        <RegisterInput
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading || showReloadButton} // Disable inputs
        />

        <RegisterButton type="submit" disabled={loading || showReloadButton}>
          Registrati
        </RegisterButton>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register;