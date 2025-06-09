import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Keep Link for other buttons
import { useAuth } from "../../hooks/authContext"; // Assuming these are needed
import { STRAPI_BASE_API_URL } from "../../data/api"; // Assuming these are needed
import { Pages } from "../../data/constants";

import {
  PrimaryButton,
  SecondaryButton,
  TopBarContainer,
  TitleContainer,
  LogoImage,
} from "../TopBar/TopBarStyledComponent.js";

const TopBar = () => {

  const navigate = useNavigate();
  // const { user, logout } = useAuth(); // Assuming you'll use authentication state later

  return (
    <TopBarContainer>
      <TitleContainer to={Pages.HOME}>
        <LogoImage src="https://github.com/DoubleMyD/react_ottica_moderna-backup-/blob/main/public/logo192.png?raw=true" />
        <h1>My Application</h1>
      </TitleContainer>

      <PrimaryButton to={Pages.CATALOG}>Catalogo</PrimaryButton>
      <PrimaryButton to={Pages.CONTACT}>Contatti</PrimaryButton>

      <SecondaryButton to={Pages.LOGIN}>Login</SecondaryButton>
      <SecondaryButton to={Pages.REVIEWS}>Recensioni</SecondaryButton>
      <SecondaryButton to={Pages.BRAND_STORY}>BrandStory</SecondaryButton>

      {/* Example for Logout/Admin (future use):
      {user ? (
        <>
          {user.role === 'admin' && (
            <PrimaryButton to={Pages.ADMIN}>Admin Dashboard</PrimaryButton>
          )}
          <SecondaryButton onClick={logout}>Logout</SecondaryButton>
        </>
      ) : (
        <SecondaryButton to={Pages.LOGIN}>Login</SecondaryButton>
      )}
      */}
    </TopBarContainer>
  );
};

export default TopBar;
