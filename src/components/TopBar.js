import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../data/authContext";
import { STRAPI_BASE_URL } from "../data/api";

import {
  PrimaryButton,
  SecondaryButton,
  TopBarContainer,
  TitleContainer,
} from "../styles/TopBarStyledComponent";

const TopBar = () => {
  return (
    <TopBarContainer>
      <TitleContainer>
        <h1>My Application</h1>
      </TitleContainer>
      <PrimaryButton>Catalogo</PrimaryButton>
      <PrimaryButton>Contatti</PrimaryButton>

      <SecondaryButton>Login</SecondaryButton>
      <SecondaryButton>Recensioni</SecondaryButton>
      <SecondaryButton>BrandStory</SecondaryButton>
    </TopBarContainer>
  );
};

export default TopBar;
