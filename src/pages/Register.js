import React, { useState } from "react";
import {
  RegisterContainer,
  RegisterForm,
  RegisterTitle,
  RegisterLabel,
  RegisterInput,
  RegisterButton,
} from "../styles/StyledRegisterComponents";

import { useNavigate } from "react-router-dom";
import { STRAPI_BASE_URL } from "../data/api"; 

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate(); // initiate useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${STRAPI_BASE_URL}/auth/local/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            localStorage.setItem('jwt', data.jwt); // Store JWT in local storage

            console.log('Registration successful:', data);
            navigate('/complete-profile'); // Redirect to complete profile page after successful registration
        } catch (error) {
            console.error('Error during registration:', error);
        }
    }

    return (
      <RegisterContainer>
        <RegisterForm onSubmit={handleSubmit}>
          <RegisterTitle>Ottica Moderna - Registrazione</RegisterTitle>

          <RegisterLabel>Username</RegisterLabel>
          <RegisterInput
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <RegisterLabel>Email</RegisterLabel>
          <RegisterInput
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <RegisterLabel>Password</RegisterLabel>
          <RegisterInput
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <RegisterButton type="submit">Registrati</RegisterButton>
        </RegisterForm>
      </RegisterContainer>
    );
};

export default Register;