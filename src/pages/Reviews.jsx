// src/pages/ReviewsPage.jsx
import React, { useState, useEffect } from "react"; // Import useState, useEffect
import { useNavigate } from "react-router-dom";
import useReviews from "../hooks/useReviews";

import ReviewCard from "../components/Reviews/ReviewCard";
import {
  ReviewsPageContainer,
  ReviewsTitle,
  ReviewsListGrid,
  WriteReviewButton,
} from "../components/Reviews/StyledReviews";

import { NotFoundMessage } from "../styles/StyledProductDetails";
import { useAuth } from "../hooks/authContext";
import { Role } from "../data/constants";

// Import the new ReviewFormModal
import ReviewFormModal from "../components/Modals/ReviewFormModal";

// Corrected component signature: props should be an object
const ReviewsPage = ({ productId, generalFaq, disableInteraction = false }) => {
  // State to control the visibility of the review form modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Determine the correct product ID to pass to useReviews
  // If productId is passed directly, use it. Otherwise, if it's from route params, extract it.
  // If generalFaq is true, ensure correctProductId is null for general reviews.
  const correctProductId = generalFaq
    ? null
    : productId?.productId || productId;

  // The useReviews hook will handle filtering based on correctProductId (or null for general)
  const { reviews, loading, error, refetchReviews } =
    useReviews(correctProductId);

  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const handleWriteReviewClick = () => {
    if (!isAuthenticated) {
      // Optionally redirect to login or show a message
      window.alert("Devi essere autenticato per scrivere una recensione.");
      // navigate('/login'); // Uncomment if you have a login route
      return;
    }
    setIsReviewModalOpen(true); // Open the modal
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const handleReviewSuccess = () => {
    // After a successful review submission, re-fetch reviews to update the list
    refetchReviews();
  };

  if (loading) {
    return (
      <ReviewsPageContainer>
        <p>Caricamento recensioni...</p>
      </ReviewsPageContainer>
    );
  }

  if (error) {
    return (
      <ReviewsPageContainer>
        <NotFoundMessage>
          Errore nel caricamento delle recensioni: {error}
        </NotFoundMessage>
      </ReviewsPageContainer>
    );
  }

  const showWriteReviewButton = role !== null && role !== Role.ADMIN;

  return (
    <ReviewsPageContainer
      $disableInteraction={disableInteraction.disableInteraction}
    >
      <ReviewsTitle>
        {correctProductId ? "Recensioni Prodotto" : "Recensioni Clienti"}
      </ReviewsTitle>
      {reviews.length === 0 ? (
        <NotFoundMessage>
          Non ci sono ancora recensioni{" "}
          {correctProductId ? "per questo prodotto" : "generali"}.
        </NotFoundMessage>
      ) : (
        <ReviewsListGrid>
          {console.log("review page", disableInteraction)}
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              disableInteraction={disableInteraction}
            />
          ))}
        </ReviewsListGrid>
      )}
      {showWriteReviewButton && (
        <WriteReviewButton onClick={handleWriteReviewClick}>
          Scrivi una recensione
        </WriteReviewButton>
      )}
      {/* Render the ReviewFormModal */}
      <ReviewFormModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        productId={correctProductId} // Pass the product ID to link the review
        onSuccess={handleReviewSuccess}
      />
    </ReviewsPageContainer>
  );
};

export default ReviewsPage;
