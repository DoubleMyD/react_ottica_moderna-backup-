// src/components/ClientDashboard/ClientDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../data/authContext"; // Assuming you have an auth context
import { Pages } from "../data/constants"; // For logout redirect

import ClientProfileSection from "../components/ClientProfile/ClientProfileSection"; // Your existing profile component
import PurchaseHistorySection from "../components/ClientPurchase/ClientPurchase"; // The new placeholder component
import TopBar from "../components/TopBar/TopBar";

import {
  DashboardLayout,
  Sidebar,
  SidebarItem,
  LogoutButton,
  MainContent,
} from "../styles/StyledClientDashboard";

const ClientDashboard = () => {
  const [activeSection, setActiveSection] = useState("profile"); // Default section is 'profile'
  const navigate = useNavigate();
  const { logout } = useAuth(); // Assuming useAuth provides a logout function

  const handleLogout = () => {
    logout(); // Perform logout logic (clear tokens, etc.)
    navigate(Pages.HOME); // Redirect to home page after logout
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "profile":
        return <ClientProfileSection />;
      case "purchases":
        return <PurchaseHistorySection />;
      default:
        return <ClientProfileSection />; // Fallback to profile
    }
  };

  return (
    <div>
      <TopBar />

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
    </div>
  );
};

export default ClientDashboard;
