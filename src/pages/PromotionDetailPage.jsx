// src/pages/PromotionDetailPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePromotionDetail from '../hooks/usePromotionDetail'; // <--- Your new hook
import { STRAPI_BASE_URL } from '../data/api'; // For constructing image URLs

import {
  PromotionDetailPageContainer,
  BackArrowButton,
  PromotionHeader,
  PromotionTitle,
  PromotionMeta,
  PromotionDescription,
  ProductsInPromotionSection,
  ProductsInPromotionTitle,
  ProductGrid,
  ProductCard,
  ProductImage,
  ProductName,
  ProductApplicationDetails,
  NoProductsMessage,
  NotFoundMessage,
  Loader,
} from '../styles/StyledPromotionDetailsPage'; // <--- Your new styled components

import { MdDateRange, MdCalendarToday, MdOutlineLocalOffer } from 'react-icons/md'; // Example icons
import { Pages } from '../data/constants';

const PromotionDetailPage = () => {
  const { documentId: promotionDocumentId } = useParams(); // Get the promotion ID from the URL
  const navigate = useNavigate();

  const { promotion, loading, error, refetch } = usePromotionDetail(promotionDocumentId);

  const handleGoBack = () => {
    navigate(-1); // Navigates to the previous page
  };

  const handleProductClick = (documentId) => {
    if (documentId) {
      navigate(`${Pages.CATALOG}/${documentId}`); // Navigate to the product detail page
    }
  };

  const formatItalianDate = (dateString) => {
    if (!dateString) return 'N.D.';
    try {
      return new Date(dateString).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Data non valida';
    }
  };

  if (loading) {
    return (
      <PromotionDetailPageContainer>
        <Loader>Caricamento dettagli promozione...</Loader>
      </PromotionDetailPageContainer>
    );
  }

  if (error) {
    return (
      <PromotionDetailPageContainer>
        <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>
        <NotFoundMessage>Errore: {error}</NotFoundMessage>
        <button onClick={refetch}>Riprova</button> {/* Add a retry button */}
      </PromotionDetailPageContainer>
    );
  }

  if (!promotion || !promotion.id) {
    return (
      <PromotionDetailPageContainer>
        <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>
        <NotFoundMessage>Promozione non trovata.</NotFoundMessage>
      </PromotionDetailPageContainer>
    );
  }

  // Destructure main promotion details (Strapi v5 flattened structure)
  const { titolo, descrizione, data_inizio, data_fine, dettaglio_promozionis } = promotion;

  const getPromotionStatus = (start, end) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = start ? new Date(start) : null;
    if (startDate) startDate.setHours(0, 0, 0, 0);
    const endDate = end ? new Date(end) : null;
    if (endDate) endDate.setHours(0, 0, 0, 0);

    if (startDate && today < startDate) return 'Futura';
    if (endDate && today > endDate) return 'Scaduta';
    if (startDate && endDate && today >= startDate && today <= endDate) return 'Attiva';
    if (startDate && !endDate && today >= startDate) return 'Attiva';
    if (!startDate && endDate && today <= endDate) return 'Attiva';
    return 'N.D.';
  };

  const promotionStatus = getPromotionStatus(data_inizio, data_fine);

  const hasDettaglioPromozionis = dettaglio_promozionis && dettaglio_promozionis.length > 0;

  return (
    <PromotionDetailPageContainer>
      <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>

      <PromotionHeader>
        <PromotionTitle>{titolo || "Promozione"}</PromotionTitle>
        <PromotionMeta>
          <span><MdCalendarToday /> Inizio: {formatItalianDate(data_inizio)}</span>
          <span><MdDateRange /> Fine: {formatItalianDate(data_fine)}</span>
          <span><MdOutlineLocalOffer /> Stato: {promotionStatus}</span>
          <span>Codice Promozione: {promotion.id}</span> {/* Assuming promotion ID acts as code */}
        </PromotionMeta>
        <PromotionDescription>{descrizione || "Nessuna descrizione disponibile per questa promozione."}</PromotionDescription>
      </PromotionHeader>

      <ProductsInPromotionSection>
        <ProductsInPromotionTitle>Prodotti Coinvolti</ProductsInPromotionTitle>
        {!hasDettaglioPromozionis ? (
          <NoProductsMessage>Nessun prodotto coinvolto in questa promozione.</NoProductsMessage>
        ) : (
          <ProductGrid>
            {dettaglio_promozionis.map((dettaglio) => {
              const product = dettaglio.prodottos[0]; // Direct access to populated product
              if (!product) return null; // Skip if product data is missing

              const imageUrl = product.immagine?.url || `https://placehold.co/150x150/CCCCCC/333333?text=No+Image`;
              const applicationType = dettaglio.tipo_applicazione;
              const value = dettaglio.valore;

              return (
                <ProductCard key={product.id} onClick={() => handleProductClick(product.documentId)}>
                  <ProductImage src={`${STRAPI_BASE_URL}${imageUrl}`} alt={product.nome || "Immagine Prodotto"} />
                  <ProductName>{product.nome || "Nome Prodotto"}</ProductName>
                  <ProductApplicationDetails>
                    {applicationType && value !== undefined && (
                      `Tipo: ${applicationType} | Valore: ${value}`
                    )}
                    {/* Add more product details if needed, e.g., original price */}
                    {product.prezzo_unitario && (
                        `Prezzo: €${product.prezzo_unitario.toFixed(2)}`
                    )}
                  </ProductApplicationDetails>
                </ProductCard>
              );
            })}
          </ProductGrid>
        )}
      </ProductsInPromotionSection>
    </PromotionDetailPageContainer>
  );
};

export default PromotionDetailPage;