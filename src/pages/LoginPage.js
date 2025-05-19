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

import { Role } from "../data/constants";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: "", //username or email
    password: "",
  });

  const [error, setError] = useState(null); //state to check if there is an error in the login
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

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent the default behaviour of the form
    setLoading(true); //set the loading state to true
    setError(null); //reset the error state

    //the data is sent to the API
    try {
      const response = await fetch(`${STRAPI_BASE_URL}/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      //handle the error if the response is not ok
      if (!response.ok) {
        if (response.status === 400) {
          setError("Credenziali non valide. Riprova."); // Show error if 400 (Bad Request)
        } else {
          setError(`Errore del server: ${response.status}`); // Show error for other status codes
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); //get the data from the response

      const userResponse = await fetch(`${STRAPI_BASE_URL}/users/me?populate=role`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.jwt}`, //set the authorization header with the token
        },
      });

      if (!userResponse.ok) {
        setError("Errore durante il recupero dei dettagli utente.");
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }

      const userData = await userResponse.json();

      switch (userData.role.name) {
        case Role.ADMIN:
          login(data.jwt, userData.role.name);
          navigate("/admin");
          break;
        case Role.CLIENT:
          login(data.jwt, userData.role.name);
          navigate("/client");
          break;
        default:
          login(data.jwt, "user");
          navigate("/user"); //go to the default page of a generic user
      }
    } catch (error) {
      console.error("Errore durante il login:", error);
    } finally {
      setLoading(false); // stop the loading state
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LoginTitle>Accedi</LoginTitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {loading && <Loader>Caricamento...</Loader>}

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

        <LoginButton type="submit" disabled={loading}>
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
