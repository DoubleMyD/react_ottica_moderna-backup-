import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../data/authContext";
import { STRAPI_BASE_URL } from "../../data/api";
import { Pages } from "../../data/constants";

import {
  PrimaryButton,
  SecondaryButton,
  TopBarContainer,
  TitleContainer,
} from "../TopBar/TopBarStyledComponent.js";

const TopBar = () => {

  const navigate = useNavigate();

  return (
    <TopBarContainer>
      <TitleContainer>
        <h1>My Application</h1>
      </TitleContainer>
      
      <PrimaryButton as={Link} to={Pages.CATALOG}>Catalogo</PrimaryButton>
      
      <PrimaryButton as={Link} to={Pages.CONTACT}>Contatti</PrimaryButton>

      <SecondaryButton as={Link} to={Pages.LOGIN}>Login</SecondaryButton>
      
      <SecondaryButton as={Link} to={Pages.REVIEWS}>Recensioni</SecondaryButton>
      
      <SecondaryButton as={Link} to={Pages.BRAND_STORY}>BrandStory</SecondaryButton>
    
    </TopBarContainer>
  );
};

export default TopBar;
