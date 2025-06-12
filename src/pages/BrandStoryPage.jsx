// src/pages/BrandStoryPage.jsx
import React from 'react';
import {
  BrandStoryContainer,
  SectionWrapper,
  SectionImage,
  SectionContent,
  SectionTitle,
  SectionDescription,
  BrandStoryTitle,
} from '../styles/StyledBrandStory'; // Assuming styled components are here
import { STRAPI_BASE_URL } from '../data/api'; // Assuming your Strapi base URL is here

// This data would ideally come from a Strapi singleton (e.g., 'brand-story' content type)
// or a custom hook fetching data. For now, we'll use placeholder data.
const brandStoryContent = [
  {
    id: 1,
    title: "La Nostra Origine: Visione e Passione",
    description: "Tutto ebbe inizio in un piccolo laboratorio artigianale, animato dalla passione per l'ottica di precisione e un'irrefrenabile desiderio di innovazione. Volevamo creare qualcosa di più di semplici occhiali: volevamo plasmare strumenti che migliorassero la vita, con stile e comfort ineguagliabili. Questo è il cuore della nostra storia, un viaggio che ci ha portato da un'idea audace a un marchio riconosciuto per l'eccellenza.",
    imageUrl: "/uploads/placeholder_brand_story_1.jpg", // Placeholder path, replace with actual Strapi URL
    imageAlt: "Primo laboratorio artigianale Ottica Moderna",
    imageLeft: true, // Image on the left for this section
  },
  {
    id: 2,
    title: "Innovazione e Artigianalità",
    description: "Ogni montatura è il risultato di un connubio perfetto tra tecnologia all'avanguardia e l'antica arte della lavorazione manuale. I nostri maestri artigiani dedicano ore a perfezionare ogni dettaglio, assicurando che ogni pezzo non sia solo bello da vedere, ma anche ergonomico e durevole. Questa dedizione alla qualità è ciò che ci distingue e ciò che garantisce ai nostri clienti un prodotto superiore.",
    imageUrl: "/uploads/placeholder_brand_story_2.jpg", // Placeholder path
    imageAlt: "Artigiano al lavoro su una montatura di occhiali",
    imageLeft: false, // Image on the right for this section
  },
  {
    id: 3,
    title: "Un Futuro Fatto di Luce",
    description: "Guardiamo al futuro con l'impegno di continuare a esplorare nuove frontiere nel design e nella tecnologia ottica. La sostenibilità è al centro della nostra missione, guidandoci nella scelta dei materiali e nei processi produttivi. Vogliamo non solo illuminare lo sguardo dei nostri clienti, ma anche contribuire a un mondo più chiaro e sostenibile per tutti.",
    imageUrl: "/uploads/daviddoe_strapi_dc0d0a89a1.jpeg", // Placeholder path
    imageAlt: "Vista panoramica con un tramonto che simboleggia il futuro",
    imageLeft: true, // Image on the left for this section
  },
];

const BrandStoryPage = () => {
  return (
    <BrandStoryContainer>
      <BrandStoryTitle>La Storia del Nostro Brand</BrandStoryTitle>

      {brandStoryContent.map((section) => (
        <SectionWrapper key={section.id} imageLeft={section.imageLeft}>
          <SectionImage
            src={`${STRAPI_BASE_URL}${section.imageUrl}`} // Use STRAPI_BASE_URL for relative paths
            alt={section.imageAlt}
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/CCCCCC/333333?text=Immagine+non+disponibile`; }} // Fallback image on error
          />
          <SectionContent>
            <SectionTitle>{section.title}</SectionTitle>
            <SectionDescription>{section.description}</SectionDescription>
          </SectionContent>
        </SectionWrapper>
      ))}
    </BrandStoryContainer>
  );
};

export default BrandStoryPage;