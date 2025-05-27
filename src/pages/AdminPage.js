import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importa Link per la pagina di registrazione
import { useAuth } from "../data/authContext"; //fornisce il contesto di autenticazione
import { API_URL } from "../data/api";
import TopBar from "../components/TopBar/TopBar";

const AdminPage = () => {

    return (
        <div>
            <TopBar />
        </div>
    )
}

export default AdminPage;