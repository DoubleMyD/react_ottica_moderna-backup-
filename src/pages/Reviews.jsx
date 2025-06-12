// src/pages/ReviewsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useReviews from '../hooks/useReviews';

import ReviewCard from '../components/Reviews/ReviewCard';
import { // <-- CORRECT: Import styled components from their dedicated styled file
  ReviewsPageContainer,
  ReviewsTitle,
  ReviewsListGrid,
  WriteReviewButton,
} from '../components/Reviews/StyledReviews';

import { NotFoundMessage } from '../styles/StyledProductDetails'; // Reuse NotFoundMessage style

const ReviewsPage = () => {
  const { reviews, loading, error } = useReviews();
  const navigate = useNavigate();

  const handleWriteReviewClick = () => {
    navigate('/write-review');
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
        <NotFoundMessage>Errore nel caricamento delle recensioni: {error}</NotFoundMessage>
      </ReviewsPageContainer>
    );
  }

  if (reviews.length === 0) {
    return (
      <ReviewsPageContainer>
        <ReviewsTitle>Recensioni Clienti</ReviewsTitle>
        <NotFoundMessage>Non ci sono ancora recensioni.</NotFoundMessage>
        <WriteReviewButton onClick={handleWriteReviewClick}>Scrivi una recensione</WriteReviewButton>
      </ReviewsPageContainer>
    );
  }

  return (
    <ReviewsPageContainer>
      <ReviewsTitle>Recensioni Clienti</ReviewsTitle>
      <ReviewsListGrid>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </ReviewsListGrid>
      <WriteReviewButton onClick={handleWriteReviewClick}>Scrivi una recensione</WriteReviewButton>
    </ReviewsPageContainer>
  );
};

export default ReviewsPage;