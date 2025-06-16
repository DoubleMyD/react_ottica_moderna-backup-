// src/components/ReviewCarousel.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pages } from "../../data/constants";

import {
  ReviewCardContainer,
  ReviewHeader,
  StarRating,
  ReviewTitle,
  ReviewMeta,
  ReviewDescription,
  ReviewUser,
  ReviewDate,
} from "../ReviewShowcase/StyledReviewCard";
import { CarouselWrapper} from "../ReviewShowcase/StyledCarousel"; // Keep the wrapper
import { ButtonContainer, CtaButton } from "../../styles/StyledCTAButton"; 
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css"; // Core Swiper styles
import "swiper/css/navigation"; // Styles for navigation buttons
import "swiper/css/pagination"; // Styles for pagination dots (if you use them)
import "swiper/css/effect-coverflow"; // For a more circular/3D effect

// Import Swiper modules
import {
  Navigation,
  Pagination,
  EffectCoverflow,
  Autoplay,
  EffectCube,
  EffectFade,
  EffectFlip,
  EffectCards,
  EffectCreative,
} from "swiper/modules";

// Helper for generating star rating (e.g., "★★★★★")
const generateStars = (rating) => {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
};

// --- Single Review Card Component (No changes needed here) ---
const ReviewCard = ({ review }) => {
  
  return (
    <ReviewCardContainer>
      <ReviewHeader>
        <StarRating>{generateStars(review.stelle)}</StarRating>
        <ReviewTitle>{review.titolo}</ReviewTitle>
      </ReviewHeader>
      <ReviewMeta>
        {review && review.cliente ? (
          <ReviewUser>
            {`${review.cliente.nome} ${review.cliente.cognome}`}
          </ReviewUser>
        ) : (
          <p>Loading review details...</p>
          // Or a spinner, skeleton loader, etc.
        )}
        <ReviewDate>{review.data}</ReviewDate>
      </ReviewMeta>
      <ReviewDescription>{review.descrizione}</ReviewDescription>
    </ReviewCardContainer>
  );
};

// --- Main Review Carousel Component using Swiper ---
const ReviewShowcase = ({ reviews }) => {
  const navigate = useNavigate();

  return (
    <CarouselWrapper>
      <Swiper
        modules={[
          Navigation,
          Pagination,
          EffectCoverflow,
          Autoplay,
          EffectCube,
          EffectFade,
          EffectFlip,
          EffectCards,
          EffectCreative,
        ]} // Enable modules
        effect={"coverflow"} // Choose the effect (e.g., 'coverflow', 'cube', 'flip', 'fade')
        grabCursor={true}
        centeredSlides={true}
        loop={true} // For circular/infinite looping
        slidesPerView={3} // Show 3 slides at once on larger screens
        spaceBetween={30} // Space between slides
        navigation={true} // Enable navigation arrows
        pagination={{ clickable: true }} // Enable pagination dots
        coverflowEffect={{
          rotate: 45, // Slide rotate in degrees
          stretch: 30, // Stretch space between slides
          depth: 100, // Depth offset
          modifier: 1, // Effect multiplier
          slideShadows: false, // Enable slide shadows
        }}
        autoplay={{
          delay: 5000, // Slide every 5 seconds
          disableOnInteraction: false, // Don't stop autoplay on user interaction
        }}
        breakpoints={{
          // Responsive breakpoints
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        }}
        className="mySwiper" // You can add a custom class for more specific styling
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>

      <ButtonContainer>
        <CtaButton to={Pages.REVIEWS}>Vedi Tutte le Recensioni</CtaButton>
      </ButtonContainer>

    </CarouselWrapper>
  );
};

export default ReviewShowcase;
