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
import AdminProductsSection from "../components/AdminProducts/AdminProducts";

import styled from "styled-components";
import { Colors } from "../styles/colors";
// Import ALL stat cards (ensure correct paths)
import TotalRevenueCard from "../components/Stats/GeneralStats/TotalRevenueCard";
import TotalTransactionsCard from "../components/Stats/GeneralStats/TotalTransactionsCard";
import AverageOrderValueCard from "../components/Stats/GeneralStats/AverageOrderValueCard";
import MonthlyRevenueGrowthCard from "../components/Stats/GeneralStats/MonthlyRevenueGrowthCard";
import AvgItemsPerTransactionCard from "../components/Stats/GeneralStats/AvgItemsPerTransactionCard";

import TotalRegisteredClientsCard from "../components/Stats/ClientsStats/TotalRegisteredClientsCard";
import NewClientsCountCard from "../components/Stats/ClientsStats/NewClientsCountCard";
import ReturningClientsPercentageCard from "../components/Stats/ClientsStats/ReturningClientsPercentageCard";
import AverageCustomerSpendCard from "../components/Stats/ClientsStats/AverageCustomerSpendCard";
import ClientsByTypeDistributionCard from "../components/Stats/ClientsStats/ClientsByTypeDistributionCard";

import MostSoldProductCard from "../components/Stats/ProducPromotionStats/MostSoldProductCard"; // NEW
import MostProfitableProductTypeCard from "../components/Stats/ProducPromotionStats/MostProfitableProductTypeCard"; // NEW
import TopContributingBrandCard from "../components/Stats/ProducPromotionStats/TopContributingBrandCard"; // NEW
import SalesSeasonalityCard from "../components/Stats/ProducPromotionStats/SalesSeasonalityCard"; // NEW
import PromotionUsageRateCard from "../components/Stats/ProducPromotionStats/PromotionUsageRateCard"; // NEW - Renamed from usePromotionUsageStats

// NEW: Import the last 5 promotion-related cards
import TotalActivePromotionsCard from "../components/Stats/PromotionsStats/TotalActivePromotionsCard";
import AvgClientsPerPromotionCard from "../components/Stats/PromotionsStats/AvgClientsPerPromotionCard";
import PromotionWithMostProductsCard from "../components/Stats/PromotionsStats/PromotionWithMostProductsCard";
import LongestPromotionCard from "../components/Stats/PromotionsStats/LongestPromotionCard";
import PromotionsByClientTypeDistributionCard from "../components/Stats/PromotionsStats/PromotionsByClientTypeDistributionCard";

const AdminDashboardPage = () => {
  const {logout} = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Memoize getActiveSectionFromUrl to prevent it from changing on every render
  // This will also extract typeId if present
  const getActiveSectionFromUrlAndParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const section =
      params.get("section") || AdminSection.Dashboard_Overview;
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
      case AdminSection.Dashboard_Overview: // NEW CASE for overall dashboard/profiling
        return (
          <StatsGridContainer>
            {/* First 5 Stats */}
            <TotalRevenueCard />
            <TotalTransactionsCard />
            <AverageOrderValueCard />
            <MonthlyRevenueGrowthCard />
            <AvgItemsPerTransactionCard />
            {/* Next 5 Stats (Client-focused) */}
            <TotalRegisteredClientsCard />
            <NewClientsCountCard />
            <ReturningClientsPercentageCard />
            <AverageCustomerSpendCard />
            <ClientsByTypeDistributionCard />
            {/* Last 5 Stats (General Product/Promotion-focused) */}
            <MostSoldProductCard />
            <MostProfitableProductTypeCard />
            <TopContributingBrandCard />
            <SalesSeasonalityCard />
            <PromotionUsageRateCard />
            {/* NEW: All promotions-specific Stats */}
            <TotalActivePromotionsCard />
            <AvgClientsPerPromotionCard />
            <PromotionWithMostProductsCard />
            <LongestPromotionCard />
            <PromotionsByClientTypeDistributionCard />
          </StatsGridContainer>
        );

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
        return <AdminProductsSection />;
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
            onClick={() =>
              handleSectionChange(AdminSection.PromotionalCampaigns)
            }
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
        <AdminContentArea>{renderMainContent()}</AdminContentArea>
      </AdminMainContent>
    </AdminDashboardContainer>
  );
};

export default AdminDashboardPage;
