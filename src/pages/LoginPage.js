import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../data/authContext";
import { STRAPI_BASE_URL } from "../data/api";
import {
  ErrorMessage,
  Loader,
  LoginButton,
  LoginInput,
  LoginLabel,
  RegistrationLink,
  LoginContainer,
  LoginForm,
  LoginTitle,
} from "../styles/StyledLoginComponents";

import { Pages, Role } from "../data/constants"; // Ensure Pages and Role are correctly imported

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: "", //username or email
    password: "",
  });

  const [error, setError] = useState(null); //state to check if there is an error in the login
  const [showReloadButton, setShowReloadButton] = useState(false); // New state for reload button
  const [loading, setLoading] = useState(false); //state to handle the loading state
  const navigate = useNavigate(); //use the navigate hook function to redirect the user to the home page after login
  const { login } = useAuth(); //use the authentication context to get the login function

  //handle the change in the input form
  const handleChange = (e) => {
    const { name, value } = e.target; //get the name and value of the input

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
    setLoading(true);
    setError(null); // Reset error
    setShowReloadButton(false); // Hide reload button initially

    const controller = new AbortController(); // Create an AbortController
    const id = setTimeout(() => controller.abort(), 10000); // Set timeout for 10 seconds (10000 ms)

    try {
      // Step 1: Authenticate user credentials
      const response = await fetch(`${STRAPI_BASE_URL}/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal, // Pass the abort signal to the fetch request
      });

      clearTimeout(id); // Clear the timeout if the fetch completes

      if (!response.ok) {
        if (response.status === 400) {
          setError("Credenziali non valide. Riprova.");
        } else {
          setError(`Errore del server: ${response.status}.`);
        }
        // Throw error to be caught by the outer catch block
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const authData = await response.json(); // Renamed data to authData for clarity

      // Step 2: Fetch detailed user data (including role)
      const userResponse = await fetch(
        `${STRAPI_BASE_URL}/users/${authData.user.id}?populate=role`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authData.jwt}`,
          },
          signal: controller.signal, // Also apply timeout to this fetch
        }
      );

      clearTimeout(id); // Clear timeout again if it reached here after first fetch

      if (!userResponse.ok) {
        setError("Errore durante il recupero dei dettagli utente.");
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }

      const userData = await userResponse.json();

      // Step 3: Check for associated cliente data if the user is a CLIENT
      let clienteFound = false;
      if (userData.role.name === Role.CLIENT) {
        try {
          const clienteResponse = await fetch(
            `${STRAPI_BASE_URL}/clientes?filters[user][id][$eq]=${userData.id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${authData.jwt}`,
              },
              signal: controller.signal,
            }
          );
          clearTimeout(id);

          if (!clienteResponse.ok) {
            console.warn(
              `Errore durante il recupero del profilo cliente: ${clienteResponse.status}`
            );
            // Do not block login, just log a warning if fetching client profile fails.
            // A specific error will be shown if clienteData is definitively not found below.
          } else {
            const clienteData = await clienteResponse.json();
            if (clienteData.data && clienteData.data.length > 0) {
              clienteFound = true;
            }
          }
        } catch (clienteError) {
          console.warn(
            "Si è verificato un errore durante il tentativo di recuperare il profilo cliente:",
            clienteError
          );
          // If there's a network error during client fetch, it's not a "not found" scenario but a fetch issue.
          // Still proceed with login, but client profile might not be complete.
        }
      }

      // Step 4: Log in user and navigate based on role and cliente data presence
      login(authData.jwt, userData.role.name); // Authenticate user in context

      switch (userData.role.name) {
        case Role.ADMIN:
          navigate(Pages.ADMIN);
          break;
        case Role.CLIENT:
          if (clienteFound) {
            navigate(Pages.CLIENT_DASHBOARD);
          } else {
            setError(
              "Utente trovato, ma nessun profilo cliente associato. Si prega di completare i dati anagrafici nel proprio profilo."
            );
            navigate(Pages.CLIENT_PROFILE); // Redirect to profile page to complete data
          }
          break;
        default:
          navigate(Pages.HOME); // Default role navigation
      }
    } catch (error) {
      if (error.name === "AbortError") {
        setError(
          "Il server non ha risposto in tempo. Controlla la tua connessione o riprova."
        );
        setShowReloadButton(true); // Show reload button on timeout
      } else if (error.message.includes("400")) {
        // This is handled by the !response.ok check above, but as a safeguard.
        // The more specific "Credenziali non valide" is already set there.
        // No change needed here, as the initial 400 error is caught first.
      } else {
        console.error("Errore durante il login:", error);
        setError("Si è verificato un errore inaspettato. Riprova.");
        setShowReloadButton(true); // Also show reload button for unexpected errors
      }
    } finally {
      setLoading(false); // Stop loading regardless of outcome
      clearTimeout(id); // Ensure timeout is cleared in all cases
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LoginTitle>Accedi</LoginTitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {loading && <Loader>Caricamento...</Loader>}

        {/* Conditionally render the reload button */}
        {showReloadButton &&
          !loading && ( // Only show if not currently loading
            <LoginButton type="button" onClick={resetFormState}>
              Riprova
            </LoginButton>
          )}

        <LoginLabel htmlFor="identifier">Email:</LoginLabel>
        <LoginInput
          type="email"
          name="identifier"
          placeholder="Email"
          value={formData.identifier}
          onChange={handleChange}
          required
        />

        <LoginLabel htmlFor="password">Password:</LoginLabel>
        <LoginInput
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <LoginButton type="submit" disabled={loading || showReloadButton}>
          Login
        </LoginButton>

        <RegistrationLink>
          <Link to="/register">Registrati ora</Link>
        </RegistrationLink>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;
