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

import { Pages, Role } from "../data/constants";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: "", //username or email
    password: "",
  });

  const [error, setError] = useState(null); //state to check if there is an error in the login
  const [showReloadButton, setShowReloadButton] = useState(false); // New state for reload button
  const [loading, setLoading] = useState(false); //state to handle the loading state
  const navigate = useNavigate(); //use the  navigate hook function to redirect the user to the home page after login
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Login response data:", data); // Log the response data for debugging
      const userResponse = await fetch(
        `${STRAPI_BASE_URL}/users/${data.user.id}?populate=role`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.jwt}`,
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

      console.log("User data:", userData); // Log user data for debugging
      switch (userData.role.name) {
        case Role.ADMIN:
          login(data.jwt, userData.role.name);
          navigate(Pages.ADMIN);
          break;
        case Role.CLIENT:
          login(data.jwt, userData.role.name);
          navigate(Pages.CLIENT_DASHBOARD);
          break;
        default:
          login(data.jwt, "user");
          navigate(Pages.HOME);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        setError(
          "Il server non ha risposto in tempo. Controlla la tua connessione o riprova."
        );
        setShowReloadButton(true); // Show reload button on timeout
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
        {showReloadButton && (
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
