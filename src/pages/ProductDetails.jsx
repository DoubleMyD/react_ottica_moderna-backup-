// src/components/ProductDetailPage/ProductDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { STRAPI_BASE_API_URL, STRAPI_BASE_URL } from "../data/api";
import { buildQueryStringV5 } from "../utils/buildQueryString";
import useProductPromotions from "../hooks/useProductPromotion";
import useProductFAQs from "../hooks/useProductFAQs"; // <--- Import the new FAQ hook

// Import your FAQList component
import FAQList from "../components/FAQ/FAQList";

import {
  ProductDetailContainer,
  BackArrowButton,
  ProductDetailHeader,
  ProductName,
  ProductContentWrapper,
  ProductImageContainer,
  ProductImage,
  ProductInfoContainer,
  ProductDescription,
  ProductPrice,
  BackButton,
  NotFoundMessage,
  PromotionsSection,
  PromotionsTitle,
  PromotionsList,
  PromotionItem,
  PromotionText,
  PlaceholderText,
} from "../styles/StyledProductDetails"; // Ensure all necessary styled components are imported

const ProductDetailPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the custom hook to fetch 'dettaglioPromozione' entries
  const {
    promotions,
    loading: promotionsLoading,
    error: promotionsError,
  } = useProductPromotions(documentId);

  // --- Use the new custom hook to fetch FAQs ---
  const {
    faqs, // This now holds the array of FAQ entries
    loading: faqsLoading,
    error: faqsError,
  } = useProductFAQs(documentId);
  // --- End of new hook usage ---

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!documentId) {
          throw new Error("Product ID is missing in the URL.");
        }

        const queryParams = {
          populate: {
            immagine: {
              fields: ["name", "alternativeText", "width", "height", "url"],
            },
          },
        };
        const queryString = buildQueryStringV5(queryParams);

        const response = await fetch(
          `${STRAPI_BASE_API_URL}/prodottos/${documentId}?${queryString}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Product with ID ${documentId} not found.`);
          }
          throw new Error(`Failed to fetch product data: ${response.statusText}`);
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [documentId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // --- Combined Loading and Error States (now includes FAQs) ---
  const overallLoading = loading || promotionsLoading || faqsLoading;
  const overallError = error || promotionsError || faqsError;

  if (overallLoading) {
    return (
      <ProductDetailContainer>
        <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>
        <p>Caricamento prodotto, promozioni e FAQ...</p>
      </ProductDetailContainer>
    );
  }

  if (overallError) {
    return (
      <ProductDetailContainer>
        <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>
        <NotFoundMessage>Errore: {overallError}</NotFoundMessage>
        <BackButton onClick={handleGoBack}>Torna Indietro</BackButton>
      </ProductDetailContainer>
    );
  }

  const currentProductData = product?.data || product;
  if (!currentProductData || !currentProductData.id) {
    return (
      <ProductDetailContainer>
        <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>
        <NotFoundMessage>Prodotto non trovato.</NotFoundMessage>
        <BackButton onClick={handleGoBack}>Torna Indietro</BackButton>
      </ProductDetailContainer>
    );
  }

  const {
    nome,
    descrizione,
    prezzo_unitario,
    immagine,
    brand,
    tipologia,
    quantita_disponibili,
  } = currentProductData;

  const imageUrl = immagine?.url || `https://placehold.co/600x400/AAAAAA/FFFFFF?text=No+Image`;
  const isAvailable = quantita_disponibili > 0;

  return (
    <ProductDetailContainer>
      <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>

      <ProductDetailHeader>
        <ProductName>{nome}</ProductName>
      </ProductDetailHeader>

      <ProductContentWrapper>
        <ProductImageContainer>
          <ProductImage src={`${STRAPI_BASE_URL}${imageUrl}`} alt={nome} />
        </ProductImageContainer>

        <ProductInfoContainer>
          <ProductPrice>{formatCurrency(prezzo_unitario)}</ProductPrice>
          <ProductDescription>{descrizione}</ProductDescription>
          <p>
            <strong>Brand:</strong> {brand}
          </p>
          <p>
            <strong>Tipo:</strong> {tipologia}
          </p>
          <p>
            <strong>Disponibilità:</strong>{" "}
            {isAvailable ? "Disponibile" : "Non Disponibile"}
          </p>

          {/* Promotions Section */}
          <PromotionsSection className="mt-8">
            <PromotionsTitle>Promozioni Rilevanti</PromotionsTitle>
            {promotionsError && (
              <PlaceholderText style={{ color: 'red' }}>
                Errore caricamento promozioni: {promotionsError}
              </PlaceholderText>
            )}
            {!promotionsLoading && promotions.length === 0 && !promotionsError && (
              <PlaceholderText>Nessuna promozione disponibile per questo prodotto.</PlaceholderText>
            )}
            {!promotionsLoading && promotions.length > 0 && (
              <PromotionsList>
                {promotions.map((dettaglioPromo) => {
                  const relatedPromozione = dettaglioPromo.promozione;
                  const tipoApplicazione = dettaglioPromo.tipo_applicazione;
                  const valore = dettaglioPromo.valore;

                  if (!relatedPromozione) return null;

                  return (
                    <PromotionItem key={dettaglioPromo.id}>
                      <PromotionText>
                        <strong>{relatedPromozione.titolo}:</strong> {relatedPromozione.descrizione}
                        {tipoApplicazione && valore !== undefined && (
                          ` (${tipoApplicazione} ${valore})`
                        )}
                        {relatedPromozione.data_inizio && relatedPromozione.data_fine && (
                          ` (Valida dal ${new Date(relatedPromozione.data_inizio).toLocaleDateString('it-IT')} al ${new Date(relatedPromozione.data_fine).toLocaleDateString('it-IT')})`
                        )}
                      </PromotionText>
                    </PromotionItem>
                  );
                })}
              </PromotionsList>
            )}
          </PromotionsSection>

          {/* --- FAQs Section --- */}
          {faqsError && (
            <PromotionsSection className="mt-8"> {/* Reuse section style */}
              <PromotionsTitle>Domande Frequenti</PromotionsTitle>
              <PlaceholderText style={{ color: 'red' }}>
                Errore caricamento FAQ: {faqsError}
              </PlaceholderText>
            </PromotionsSection>
          )}
          {!faqsLoading && faqs.length > 0 && (
            <PromotionsSection className="mt-8"> {/* Reuse section style */}
              <FAQList faqs={faqs} />
            </PromotionsSection>
          )}
          {!faqsLoading && faqs.length === 0 && !faqsError && (
            <PromotionsSection className="mt-8"> {/* Reuse section style */}
              <PromotionsTitle>Domande Frequenti</PromotionsTitle>
              <PlaceholderText>Nessuna FAQ disponibile per questo prodotto.</PlaceholderText>
            </PromotionsSection>
          )}
          {/* --- End FAQs Section --- */}

        </ProductInfoContainer>
      </ProductContentWrapper>
    </ProductDetailContainer>
  );
};

export default ProductDetailPage;