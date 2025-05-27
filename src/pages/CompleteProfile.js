import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ProfileFormContainer,
  ProfileForm,
  ProfileLabel,
  ProfileInput,
  ProfileButton,
  ProfileTitle,
} from "../styles/StyledProfileComponents";
import { STRAPI_BASE_URL } from "../data/api";

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

  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");
  console.log("Token:", token);

  // Check if the token is available
  if (!token) {
    console.error("Token not found. Please log in first.");
    return null; // or redirect to login page
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      console.error("Token not found. Please log in first.");
      return;
    }

    try {
      //fetch the data user logged to get the id
      const meRes = await fetch(`${STRAPI_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const meData = await meRes.json();

      if (!meData?.id) {
        throw new Error("User ID not found");
      }

      const userId = meData.id;

      //Update the user data based on the id
      const response = await fetch(`${STRAPI_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const updatedUserData = await response.json();
      
      if (response.ok) {
        console.log("User data updated successfully:", updatedUserData);
        navigate("/"); // Redirect to the home page after successful update
      } else {
        const errorData = updatedUserData.error || updatedUserData;
        console.error("Error updating user data:", errorData);
      }
    } catch (error) {
      console.error("Error during user data update:", error);
    }
  };

  return (
    <ProfileFormContainer>
      <ProfileTitle>
        Completa la registrazione, inserisci i tuoi dati.
      </ProfileTitle>
      <ProfileForm onSubmit={handleSubmit}>
        <ProfileLabel>Nome</ProfileLabel>
        <ProfileInput
          type="text"
          name="nome"
          placeholder="Nome"
          value={userData.nome}
          onChange={handleChange}
          required
        />
        <ProfileLabel>Cognome</ProfileLabel>
        <ProfileInput
          type="text"
          name="cognome"
          placeholder="Cognome"
          value={userData.cognome}
          onChange={handleChange}
          required
        />

        <ProfileLabel>Data di nascita</ProfileLabel>
        <ProfileInput
          type="date"
          name="data_nascita"
          placeholder="Data di Nascita"
          value={userData.data_nascita}
          onChange={handleChange}
          required
        />

        <ProfileLabel>Indirizzo</ProfileLabel>
        <ProfileInput
          type="text"
          name="indirizzo"
          placeholder="Indirizzo"
          value={userData.indirizzo}
          onChange={handleChange}
          required
        />

        <ProfileLabel>CAP</ProfileLabel>
        <ProfileInput
          type="text"
          name="cap"
          placeholder="CAP"
          value={userData.cap}
          onChange={handleChange}
          required
        />

        <ProfileLabel>Città</ProfileLabel>
        <ProfileInput
          type="text"
          name="citta"
          placeholder="Città"
          value={userData.citta}
          onChange={handleChange}
          required
        />

        <ProfileLabel>
          <input
            type="checkbox"
            name="iscrizione_newsletter"
            checked={userData.iscrizione_newsletter}
            onChange={handleChange}
          />
          Ricevi notizie via email
        </ProfileLabel>

        <ProfileButton type="submit">Completa Profilo</ProfileButton>
      </ProfileForm>
    </ProfileFormContainer>
  );
};

export default CompleteProfile;
