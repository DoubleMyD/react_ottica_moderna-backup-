import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importa Link per la pagina di registrazione
import { useAuth } from "../data/authContext"; //fornisce il contesto di autenticazione
import { API_URL } from "../data/api";
import TopBar from "../components/TopBar/TopBar";
import ShopContactSection from "../components/ContactSection/ContactSection";

const Contacts = () => {
    return(
        <ShopContactSection/>
    )
};

export default Contacts;