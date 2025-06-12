// src/components/ClientDashboard/ClientDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/authContext";
import { Pages } from "../data/constants";

import ClientProfileSection from "../components/ClientProfile/ClientProfileSection";
import PurchaseHistorySection from "../components/ClientPurchase/PurchaseHistorySection"; // <--- Import new section

import {
  DashboardLayout,
  Sidebar,
  SidebarItem,
  LogoutButton,
  MainContent,
} from "../styles/StyledClientDashboard";
import useUserAndClienteData from "../hooks/useUserAndClienteData";

const ClientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { clienteData } = useUserAndClienteData();

  // Memoize getActiveSectionFromUrl to prevent it from changing on every render
  // and satisfy the useEffect dependency without unnecessary re-renders.
  const getActiveSectionFromUrl = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return params.get("section") || "profile";
  }, [location.search]); // Depend on location.search here

  // Initialize activeSection based on URL query param, default to 'profile'
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
  }, [location.search, getActiveSectionFromUrl]); // Depend on location.search to react to URL query changes

  const handleLogout = () => {
    logout();
    navigate(Pages.HOME);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "profile":
        return <ClientProfileSection />;
      case "purchases":
        return <PurchaseHistorySection clientId={clienteData.id}/>;
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

export const ClientDashboardSection = {
  Profile: "profile",
  Purchases: "purchases",
  Promotions: "promotion",
  DettaglioPromozioni: "dettaglio-promozioni",
  GeneralFaqs: "general-faqs",
}
