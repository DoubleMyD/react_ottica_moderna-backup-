// src/components/TopBar/TopBar.jsx
import { useContext, useState } from "react"; // Keep original imports if needed by other logic
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/authContext";
import { STRAPI_BASE_API_URL } from "../../data/api";
import { Pages, Role } from "../../data/constants";

import {
  PrimaryButton,
  SecondaryButton,
  TopBarContainer,
  TitleContainer,
  LogoImage,
  NavButtonsContainer, // NEW: Import the new container
} from "../TopBar/TopBarStyledComponent.js";

const TopBar = () => {
  const { isAuthenticated, role, logout } = useAuth(); // Assuming logout is available from useAuth
  const navigate = useNavigate();

  let homePageUrl = "/"; // Default for non-authenticated
  if (isAuthenticated) {
    if (role === Role.ADMIN) homePageUrl = Pages.ADMIN;
    else if (role === Role.CLIENT)
      // Assuming CLIENT_DASHBOARD exists
      homePageUrl = Pages.CLIENT_DASHBOARD;
    else homePageUrl = Pages.CATALOG; // Default for authenticated non-admin/client
  }

  const handleLogout = () => {
    logout();
    navigate(Pages.HOME);
  };

  return (
    <TopBarContainer>
      <TitleContainer to={homePageUrl}>
        <LogoImage src="https://github.com/DoubleMyD/react_ottica_moderna-backup-/blob/main/public/logo192.png?raw=true" />
        <h1>Modern Optics</h1> {/* More descriptive title */}
      </TitleContainer>

      <NavButtonsContainer>
        {" "}
        {/* NEW: Wrap navigation buttons here */}
        {role !== Role.ADMIN && (
          <PrimaryButton to={Pages.CATALOG}>Catalogo</PrimaryButton>
        )}
        {isAuthenticated && role !== Role.ADMIN && (
          <PrimaryButton to={Pages.PROMOTIONS}>Promozioni</PrimaryButton>
        )}
        {isAuthenticated && role === Role.CLIENT && (
          <PrimaryButton to={Pages.CLIENT_DASHBOARD}>DAHSBOARD</PrimaryButton>
        )}
        {/* Admin Dashboard button, if applicable */}
        {isAuthenticated && role === Role.ADMIN && (
          <PrimaryButton to={Pages.ADMIN}>Admin</PrimaryButton>
        )}

        <SecondaryButton to={Pages.REVIEWS}>Recensioni</SecondaryButton>
        <SecondaryButton to={Pages.FAQs}>Faqs</SecondaryButton>
        <SecondaryButton to={Pages.CONTACT}>Contatti</SecondaryButton>
        <SecondaryButton to={Pages.BRAND_STORY}>BrandStory</SecondaryButton>
        {/* Conditional Login/Logout Button */}
        {!isAuthenticated ? (
          <PrimaryButton to={Pages.LOGIN}>
            Login
          </PrimaryButton> /* Changed to Primary for login CTA */
        ) : (
          <SecondaryButton onClick={handleLogout}>Logout</SecondaryButton>
        )}
      </NavButtonsContainer>
    </TopBarContainer>
  );
};

export default TopBar;
