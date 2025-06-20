// src/components/ProductDetailPage/ProductDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { STRAPI_BASE_API_URL, STRAPI_BASE_URL } from "../data/api";
import { buildQueryStringV5 } from "../utils/buildQueryString";
import useProductPromotions from "../hooks/useProductPromotion";
import useProductFAQs from "../hooks/useProductFAQs"; // <--- Import the new FAQ hook

import {
  SectionCard,
  SectionTitle,
  SectionContent,
  PromotionListItem, // NEW: Specific style for list items
  // If you decide to keep FilterTagContainer/FilterTag here for client types, import them:
  // FilterTagContainer, FilterTag
} from "../components/ClientDetail/ClientPromotionsSection/StyledClientPromotionsSection"; // Import from new style file

// Import your FAQList component
import FAQList from "../components/FAQ/FAQList";
import { formatItalianDate } from "../utils/formatters";

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
import { AdminSection, Pages, Role } from "../data/constants";
import { useAuth } from "../hooks/authContext";
import { AdminActionButton } from "../styles/StyledAdminDashboard";
import DeleteProductButton from "../components/Admin/Product/AdminProducts/DeleteProductButton";
import ProductFormModal from "../components/Modals/ProductFormModal";
import useSingleProduct from "../hooks/useSingleProduct";
import {
  ClientTypesInvolvedBlock,
  ClientTypeTag,
  ClientTypeTagList,
} from "../components/Admin/Marketing/AdminPromotionDetail/StyledAdminPromotionDetailPage";
import ReviewsPage from "./Reviews";

const ProductDetailPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const { product, loading, error, refetchProduct } =
    useSingleProduct(documentId);

  const [isModalOpen, setIsModalOpen] = useState(false); // Unified modal state

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

  // useEffect(() => {
  //   refetchProduct();
  // }, [documentId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePromotionClick = (promotionDocumentId, event) => {
    event.stopPropagation(); // Prevent row expansion if applicable
    // Navigate to a promotion detail page (e.g., /promotions/:documentId)
    navigate(`${Pages.PROMOTIONS}/${promotionDocumentId}`); // Adjust this path as per your routing
  };

  // New handler for clicking on an associated client type
  const handleAssociatedTypeClick = (typeId, event) => {
    event.stopPropagation(); // Prevent row expansion if applicable
    // Navigate to the TipologieCliente section with the specific typeId
    navigate(
      `${Pages.ADMIN}?section=${AdminSection.Profilazione_TipologieCliente}&typeId=${typeId}`
    );
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    refetchProduct(); // Refresh the product list after successful creation/update
  };

  const handleFaqSuccess = () => {
    refetchProduct();
  }

  const handleEditProduct = (e) => {
    e.stopPropagation();
    setIsModalOpen(true); // Open the modal
  };

  // The handleDeleteProduct function will now simply call the refetch after deletion
  // The actual deletion logic and modal are handled by DeleteProductButton
  const handleDeleteProductSuccess = () => {
    navigate(-1); // Refetch the list after a successful deletion
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

  const imageUrl =
    immagine?.url || `https://placehold.co/600x400/AAAAAA/FFFFFF?text=No+Image`;
  const isAvailable = quantita_disponibili > 0;

  // Map client types for rendering tags
  const involvedClientTypes =
    product?.tipologia_clientes?.map((type) => ({
      id: type.id,
      documentId: type.documentId,
      nome: type.nome,
    })) || [];

  return (
    <ProductDetailContainer>
      <BackArrowButton onClick={handleGoBack}>&larr;</BackArrowButton>

      {isAuthenticated && role === Role.ADMIN && (
        <div
          style={{
            display: "flex",

            justifyContent: "flex-end",

            marginBottom: "20px",

            gap: "20px",
          }}
        >
          <AdminActionButton
            onClick={(e) => handleEditProduct(e)}
            title="Modifica Prodotto"
          >
            {" "}
            ✏️
          </AdminActionButton>
          <DeleteProductButton
            onDeleteSuccess={handleDeleteProductSuccess}
            product={product}
          ></DeleteProductButton>
        </div>
      )}

      <ProductDetailHeader>
        <ProductName>{nome}</ProductName>
      </ProductDetailHeader>

      <ProductContentWrapper>
        <ProductImageContainer>
          <ProductImage src={`${STRAPI_BASE_URL}${imageUrl}`} alt={nome} />
          <ReviewsPage
            productId={product.id}
            generalFaq={false}
            disableInteraction={true}
          ></ReviewsPage>
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
            <PromotionsTitle>Promozioni</PromotionsTitle>
            {promotionsError && (
              <PlaceholderText style={{ color: "red" }}>
                Errore caricamento promozioni: {promotionsError}
              </PlaceholderText>
            )}
            {!promotionsLoading &&
              promotions.length === 0 &&
              !promotionsError && (
                <PlaceholderText>
                  Nessuna promozione disponibile per questo prodotto.
                </PlaceholderText>
              )}

            {promotions && promotions.length > 0 ? (
              <ul>
                {promotions.map((promo) => (
                  <PromotionListItem
                    key={promo.id}
                    onClick={(e) => handlePromotionClick(promo.documentId, e)} // Use documentId for navigation
                  >
                    <div>
                      <strong>{promo.titolo}</strong>
                      {/* Ensure description is not null/undefined before substring */}
                      <p>
                        {promo.descrizione
                          ? `${promo.descrizione.substring(0, 100)}...`
                          : "Nessuna descrizione."}
                      </p>
                      <div className="date-info">
                        {promo.data_inizio &&
                          `Inizia il: ${formatItalianDate(promo.data_inizio)}`}
                        {promo.data_fine &&
                          ` | Termina il: ${formatItalianDate(
                            promo.data_fine
                          )}`}
                      </div>

                      {/* CORRECTED SECTION BELOW */}
                      {promo.relatedDettaglioPromozionis &&
                        promo.relatedDettaglioPromozionis.length > 0 && (
                          <div>
                            {" "}
                            {/* Wrapper for the list of dettaglio_promozionis */}
                            {promo.relatedDettaglioPromozionis.map(
                              (dettaglio_promo, index) => {
                                return (
                                  <div
                                    key={dettaglio_promo.id || index}
                                    style={{ fontSize: "0.9em", color: "#555" }}
                                  >
                                    {/* Corrected property names: tipo_applicazione and valore */}
                                    {`Tipo: ${dettaglio_promo.tipo_applicazione} Sconto: ${dettaglio_promo.valore}%`}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                    </div>
                  </PromotionListItem>
                ))}
              </ul>
            ) : (
              <></>
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
                        <strong>{relatedPromozione.titolo}:</strong>{" "}
                        {relatedPromozione.descrizione}
                        {tipoApplicazione &&
                          valore !== undefined &&
                          ` (${tipoApplicazione} ${valore})`}
                        {relatedPromozione.data_inizio &&
                          relatedPromozione.data_fine &&
                          ` (Valida dal ${new Date(
                            relatedPromozione.data_inizio
                          ).toLocaleDateString("it-IT")} al ${new Date(
                            relatedPromozione.data_fine
                          ).toLocaleDateString("it-IT")})`}
                      </PromotionText>
                    </PromotionItem>
                  );
                })}
              </PromotionsList>
            )}
          </PromotionsSection>

          {isAuthenticated && role === Role.ADMIN && (
            <ClientTypesInvolvedBlock>
              <h3>ELENCO TIPOLOGIE CLIENTE COINVOLTE</h3>
              {involvedClientTypes.length > 0 ? (
                <ClientTypeTagList>
                  {involvedClientTypes.map((type) => (
                    <ClientTypeTag
                      key={type.id}
                      onClick={(e) =>
                        handleAssociatedTypeClick(type.documentId, e)
                      }
                    >
                      {type.nome}
                    </ClientTypeTag>
                  ))}
                </ClientTypeTagList>
              ) : (
                <PlaceholderText
                  style={{
                    textAlign: "left",
                    padding: "10px 0",
                    fontSize: "0.9em",
                  }}
                >
                  Nessuna tipologia cliente associata.
                </PlaceholderText>
              )}
            </ClientTypesInvolvedBlock>
          )}

          {/* --- FAQs Section --- */}
          {faqsError && (
            <PromotionsSection className="mt-8">
              {" "}
              {/* Reuse section style */}
              <PromotionsTitle>Domande Frequenti</PromotionsTitle>
              <PlaceholderText style={{ color: "red" }}>
                Errore caricamento FAQ: {faqsError}
              </PlaceholderText>
            </PromotionsSection>
          )}
          {!faqsLoading && faqs.length > 0 && (
            <PromotionsSection className="mt-8">
              {" "}
              {/* Reuse section style */}
              <FAQList faqs={faqs} />
            </PromotionsSection>
          )}
          {!faqsLoading && faqs.length === 0 && !faqsError && (
            <PromotionsSection className="mt-8">
              {" "}
              {/* Reuse section style */}
              <PromotionsTitle>Domande Frequenti</PromotionsTitle>
              <PlaceholderText>
                Nessuna FAQ disponibile per questo prodotto.
              </PlaceholderText>
            </PromotionsSection>
          )}
          {/* --- End FAQs Section --- */}
        </ProductInfoContainer>
      </ProductContentWrapper>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleFormSuccess} // Unified success callback
        initialData={product} // Pass the product data for editing
        onFaqSuccess={handleFaqSuccess}
        key={product.id} // Key to force re-render/re-initialization of modal form
      />
    </ProductDetailContainer>
  );
};

export default ProductDetailPage;
