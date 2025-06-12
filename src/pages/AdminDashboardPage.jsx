// src/pages/AdminDashboardPage.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AdminDashboardContainer,
  AdminSidebar,
  SidebarProfileImage,
  SidebarNav,
  SidebarButton,
  AdminMainContent,
  AdminHeader,
  AdminContentArea,
} from "../styles/StyledAdminDashboard";
import { AdminSection, Pages } from "../data/constants";

import ClientTypesList from "../components/ClientTypes/ClientTypesList";
import ClientList from "../components/ClientList/ClientList";
import { useAuth } from "../hooks/authContext";
import PromotionalCampaignsList from "../components/AdminPromotionalCampaign/AdminPromotionalCampaignsList";

// Placeholder components for other sections
const MarketingContent = () => (
  <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
    Contenuto Marketing (Da implementare)
  </div>
);
const ProductsContent = () => (
  <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
    Contenuto Prodotti (Da implementare)
  </div>
);

const AdminDashboardPage = () => {
  const {logout} = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Memoize getActiveSectionFromUrl to prevent it from changing on every render
  // This will also extract typeId if present
  const getActiveSectionFromUrlAndParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const section =
      params.get("section") || AdminSection.Profilazione_TipologieCliente;
    const typeId = params.get("typeId"); // Get the typeId parameter
    return { section, typeId };
  }, [location.search]);

  // Initialize activeSection and focusedTypeId based on URL query params
  const [
    { section: activeSection, typeId: focusedTypeId },
    setDashboardParams,
  ] = useState(getActiveSectionFromUrlAndParams);

  // Effect to update URL when activeSection or focusedTypeId changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("section", activeSection);
    if (focusedTypeId) {
      params.set("typeId", focusedTypeId);
    } else {
      params.delete("typeId"); // Remove typeId if it's no longer focused
    }

    const newSearch = `?${params.toString()}`;
    if (location.search !== newSearch) {
      navigate(newSearch, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, focusedTypeId, navigate]);

  // Effect to update activeSection/focusedTypeId when URL changes (e.g., from browser back/forward)
  useEffect(() => {
    const { section: urlSection, typeId: urlTypeId } =
      getActiveSectionFromUrlAndParams();
    if (activeSection !== urlSection || focusedTypeId !== urlTypeId) {
      setDashboardParams({ section: urlSection, typeId: urlTypeId });
    }
  }, [
    location.search,
    getActiveSectionFromUrlAndParams,
    activeSection,
    focusedTypeId,
  ]);

  const handleLogout = () => {
    logout();
    navigate(Pages.HOME);
  };

  // Helper function to update section, optionally clearing typeId
  const handleSectionChange = (section, clearTypeId = true) => {
    setDashboardParams((prev) => ({
      section: section,
      typeId: clearTypeId ? null : prev.typeId, // Clear typeId unless explicitly told not to
    }));
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case AdminSection.Profilazione_TipologieCliente:
        // Pass both setActiveSection and focusedTypeId to ClientTypesList
        return (
          <ClientTypesList
            setActiveSection={handleSectionChange}
            focusedTypeId={focusedTypeId}
          />
        );
      case AdminSection.Profilazione_ElencoClienti:
        // Pass setActiveSection to ClientList (no typeId needed here)
        return <ClientList setActiveSection={handleSectionChange} />;
      case AdminSection.PromotionalCampaigns:
        return <PromotionalCampaignsList />;
      case AdminSection.Prodotti:
        return <ProductsContent />;
      default:
        // Default to ClientTypesList
        return (
          <ClientTypesList
            setActiveSection={handleSectionChange}
            focusedTypeId={focusedTypeId}
          />
        );
    }
  };

  return (
    <AdminDashboardContainer>
      <AdminSidebar>
        <SidebarProfileImage>
          <img src="/path/to/admin-profile.jpg" alt="Admin Profile" />
        </SidebarProfileImage>
        <SidebarNav>
          <SidebarButton
            $active={
              activeSection === AdminSection.Profilazione_TipologieCliente ||
              activeSection === AdminSection.Profilazione_ElencoClienti
            }
            // When clicking "Profilazione Clienti", always go to Tipologie Cliente by default
            onClick={() =>
              handleSectionChange(AdminSection.Profilazione_TipologieCliente)
            }
          >
            Profilazione Clienti
          </SidebarButton>
          <SidebarButton
            $active={activeSection === AdminSection.PromotionalCampaigns}
            onClick={() => handleSectionChange(AdminSection.PromotionalCampaigns)}
          >
            Marketing
          </SidebarButton>
          <SidebarButton
            $active={activeSection === AdminSection.Prodotti}
            onClick={() => handleSectionChange(AdminSection.Prodotti)}
          >
            Prodotti
          </SidebarButton>
          <SidebarButton
            onClick={handleLogout}
            style={{
              marginTop: "auto",
              background: "none",
              borderColor: "transparent",
              color: "#ff4d4d",
              "&:hover": {
                background: "none",
                color: "#ff0000",
                borderColor: "transparent",
              },
            }}
          >
            LOG OUT
          </SidebarButton>
        </SidebarNav>
      </AdminSidebar>

      <AdminMainContent>
        <AdminHeader>
          {/* Content for AdminHeader is assumed to be provided externally or by its own component */}
        </AdminHeader>
        <AdminContentArea>{renderMainContent()}</AdminContentArea>
      </AdminMainContent>
    </AdminDashboardContainer>
  );
};

export default AdminDashboardPage;
