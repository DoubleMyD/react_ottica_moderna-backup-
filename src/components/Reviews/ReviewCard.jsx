// src/components/Reviews/ReviewCard.jsx
import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { STRAPI_BASE_URL } from '../../data/api'; // Ensure this path is correct

import {
  ReviewCardContainer,
  ReviewHeader,
  StarRating,
  ReviewTitle,
  ReviewMeta,
  ReviewDescription,
  ReviewUser,
  ReviewDate,
  ReviewProductImg,
} from './StyledReviews'; // Assuming your styled components are in this folder

import { Colors } from '../../styles/colors'; // For rendering stars
import { Pages } from "../../data/constants";

const ReviewCard = ({ review, disableInteraction = false }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location object

  // Accessing review data directly (Strapi v5 flattened structure)
  const {
    id,
    documentId,
    stelle,
    data,
    titolo,
    descrizione,
    cliente,
    prodotto,
  } = review;
  console.log("Full reviews", review);
  // Safely access cliente nome/cognome. Assuming 'nome' is available on Cliente.
  // If Cliente has 'name' and 'cognome', adjust accordingly.
  const userName =
    cliente?.nome + " " + cliente?.cognome || "Utente Sconosciuto"; // Adjust based on your Cliente content type

  // Safely access product image and ID
  const productImage = prodotto?.immagine?.url; // Direct access to image URL in v5
  const productDocumentId = prodotto?.documentId;

  const formattedDate = new Date(data).toLocaleDateString("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const renderStars = (count) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < count) {
        stars.push(
          <span key={i} style={{ color: Colors.starGold }}>
            &#9733;
          </span>
        ); // Filled star
      } else {
        stars.push(
          <span key={i} style={{ color: Colors.mediumGray }}>
            &#9734;
          </span>
        ); // Empty star outline or similar
      }
    }
    return stars;
  };

  const handleProductClick = () => {
    if (productDocumentId) {
      if (location.pathname === `${Pages.CATALOG}/${productDocumentId}`) {
        console.log("ignored");
        return;
      }
      navigate(`${Pages.CATALOG}/${productDocumentId}`); // Navigate to product detail page
    }
  };

  return (
    <ReviewCardContainer $disableInteraction={disableInteraction}>
      <div>
        {" "}
        {/* Container for header and description */}
        <ReviewHeader>
          <StarRating>{renderStars(stelle)}</StarRating>
          {productImage && productDocumentId && (
            <ReviewProductImg
              src={`${STRAPI_BASE_URL}${productImage}`}
              alt={prodotto.nome || "Product Image"} // Assuming 'nome' is on product
              $disableInteraction={disableInteraction}
              onClick={handleProductClick}
            />
          )}
        </ReviewHeader>
        <ReviewTitle>{titolo}</ReviewTitle>
        <ReviewMeta>
          <ReviewUser>{userName}</ReviewUser>
          <ReviewDate>{formattedDate}</ReviewDate>
        </ReviewMeta>
        <ReviewDescription>{descrizione}</ReviewDescription>
      </div>
    </ReviewCardContainer>
  );
};

export default ReviewCard;