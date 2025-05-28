// src/components/ShopShowcaseSection.jsx
import React from "react";
import { CtaButton } from "../../styles/StyledCTAButton";
import { Pages } from "../../data/constants"; // To link the CTA button

import {
  ShowcaseContainer,
  ImageWrapper,
  ContentWrapper,
  ShowcaseTitle,
  ShowcaseDescription,
} from "../HomeShowcase/StyledHomeShowcase";

// Dummy data for the showcase section
const showcaseData = {
  imageUrl:
    "https://github.com/DoubleMyD/react_ottica_moderna-backup-/blob/main/public/logo192.png?raw=true", // Replace with your image URL
  altText: "Ottica Moderna - La Tua Visione",
  title: "Vedi il Mondo con Nuovi Occhi",
  description:
    "Benvenuti nella nostra Ottica Moderna, dove la tradizione incontra l'innovazione. Offriamo una vasta selezione di occhiali da vista, occhiali da sole e lenti a contatto delle migliori marche, per garantirti stile, comfort e una visione perfetta. Il nostro team di esperti è pronto ad offrirti una consulenza personalizzata e un servizio eccellente.",
  ctaText: "Esplora il Catalogo",
  ctaLink: Pages.CATALOG, // Link to your catalog page
};

const ShopShowcaseSection = () => {
  return (
    <ShowcaseContainer>
      <ImageWrapper>
        <img src={showcaseData.imageUrl} alt={showcaseData.altText} />
      </ImageWrapper>
      <ContentWrapper>
        <ShowcaseTitle>{showcaseData.title}</ShowcaseTitle>
        <ShowcaseDescription>{showcaseData.description}</ShowcaseDescription>
        <CtaButton to={showcaseData.ctaLink}>{showcaseData.ctaText}</CtaButton>
      </ContentWrapper>
    </ShowcaseContainer>
  );
};

export default ShopShowcaseSection;
