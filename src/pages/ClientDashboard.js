// src/components/ClientDashboard/ClientDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../data/authContext";
import { Pages } from "../data/constants";

import ClientProfileSection from "../components/ClientProfile/ClientProfileSection";
import PurchaseHistorySection from "../components/ClientPurchase/ClientPurchase"; // <--- Import new section

import {
  DashboardLayout,
  Sidebar,
  SidebarItem,
  LogoutButton,
  MainContent,
} from "../styles/StyledClientDashboard";
import TopBar from "../components/TopBar/TopBar";

const ClientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Initialize activeSection based on URL query param, default to 'profile'
  const getActiveSectionFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get("section") || "profile";
  };

  const [activeSection, setActiveSection] = useState(getActiveSectionFromUrl);

  // Effect to update URL when activeSection changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("section", activeSection);
    navigate(`?${params.toString()}`, { replace: true }); // Use replace to avoid polluting history
  }, [activeSection, navigate]);

  // Effect to update activeSection when URL changes (e.g., from browser back/forward)
  useEffect(() => {
    setActiveSection(getActiveSectionFromUrl());
  }, [location.search]); // Depend on location.search to react to URL query changes

  const handleLogout = () => {
    logout();
    navigate(Pages.HOME);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "profile":
        return <ClientProfileSection />;
      case "purchases":
        return <PurchaseHistorySection />;
      default:
        return <ClientProfileSection />;
    }
  };

  return (
      <DashboardLayout>
        <Sidebar>
          <SidebarItem
            $isActive={activeSection === "profile"}
            onClick={() => setActiveSection("profile")}
          >
            Dati Anagrafici
          </SidebarItem>
          <SidebarItem
            $isActive={activeSection === "purchases"}
            onClick={() => setActiveSection("purchases")}
          >
            Storico Acquisti
          </SidebarItem>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </Sidebar>
        <MainContent>{renderActiveSection()}</MainContent>
      </DashboardLayout>
  );
};

export default ClientDashboard;
