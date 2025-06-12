// src/pages/GeneralFAQPage.jsx
import React from 'react';
import useGeneralFAQs from '../hooks/useGeneralFAQs'; // <--- Your new hook
import FAQList from '../components/FAQ/FAQList'; // <--- Your existing FAQList component
import { NotFoundMessage } from '../styles/StyledProductDetails'; // Reusing for generic errors

import {
  GeneralFAQPageContainer,
  GeneralFAQTitle,
  NoFAQsMessage,
} from '../styles/StyledGeneralFAQPage'; // <--- Your new styled components

const GeneralFAQPage = () => {
  const { faqs, loading, error } = useGeneralFAQs();

  if (loading) {
    return (
      <GeneralFAQPageContainer>
        <p>Caricamento domande frequenti...</p>
      </GeneralFAQPageContainer>
    );
  }

  if (error) {
    return (
      <GeneralFAQPageContainer>
        <NotFoundMessage>Errore nel caricamento delle FAQ: {error}</NotFoundMessage>
      </GeneralFAQPageContainer>
    );
  }

  return (
    <GeneralFAQPageContainer>
      <GeneralFAQTitle>Domande Frequenti</GeneralFAQTitle>
      {faqs.length === 0 ? (
        <NoFAQsMessage>Nessuna domanda frequente disponibile al momento.</NoFAQsMessage>
      ) : (
        // Reusing your existing FAQList component to render the list of FAQs
        <FAQList faqs={faqs} showTitle={false} />
      )}
    </GeneralFAQPageContainer>
  );
};

export default GeneralFAQPage;