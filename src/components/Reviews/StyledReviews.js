// src/components/Reviews/StyledReviews.js
import styled from "styled-components";
import { Colors } from "../../styles/colors";

export const ReviewCardContainer = styled.div`
  background-color: ${Colors.background}; /* White background for the card */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 10px; /* Spacing around the card, handled by Swiper's gap if needed or outer padding */
  height: auto; /* Allow height to adjust to content */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box; /* Include padding and border in the width */

  // This is the key part to ignore clicks on the container and all its children
  ${(props) =>
    props.disableInteraction &&
    `
    pointer-events: none;
    opacity: 0.7; // Optional: Add a visual cue that it's disabled
    cursor: default; // Optional: Set cursor to default for visual feedback
  `}
`;

export const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const StarRating = styled.div`
  color: ${Colors.starGold};
  font-size: 1.2rem;
  span {
    margin-right: 2px;
  }
`;

export const ReviewProductImg = styled.img`
  width: 100px;
  height: 100px;
  objectFit: cover;
  borderRadius: 4px;
  cursor: pointer;

                // This is the key part to ignore clicks on the container and all its children
  ${(props) =>
    props.$disableInteraction &&
    `
    pointer-events: none;
    opacity: 0.7; // Optional: Add a visual cue that it's disabled
    cursor: default; // Optional: Set cursor to default for visual feedback
  `}

`;

export const ReviewTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  color: ${Colors.darkText};
`;

export const ReviewMeta = styled.div`
  font-size: 0.9rem;
  color: ${Colors.lightSubtitle};
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
`;

export const ReviewDescription = styled.p`
  font-size: 1rem;
  color: ${Colors.mediumGray};
  line-height: 1.5;
  margin-top: 15px;
  flex-grow: 1; /* Allow description to take up available space */
`;

export const ReviewUser = styled.span`
  font-weight: bold;
`;

export const ReviewDate = styled.span`
  font-style: italic;
`;

// Additional styled components for the Reviews Page/List
export const ReviewsPageContainer = styled.div`
  background-color: ${Colors.lightBackground};
  padding: 40px;
  margin: 40px auto;
  max-width: 1200px; /* Max width for the content */
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  font-family: "Arial", sans-serif;
  color: ${Colors.darkText};
  display: flex;
  flex-direction: column;
  gap: 30px;

  @media (max-width: 768px) {
    padding: 20px;
    margin: 20px auto;
  }

  // This is the key part to ignore clicks on the container and all its children
  ${(props) =>
    props.disableInteraction &&
    `
    pointer-events: none;
    opacity: 0.7; // Optional: Add a visual cue that it's disabled
    cursor: default; // Optional: Set cursor to default for visual feedback
  `}
`;

export const ReviewsListGrid = styled.div`
  display: grid;
  gap: 20px; /* Space between cards */
  justify-content: center; /* Center the grid items if they don't fill the row */

  /* Default for smaller screens (e.g., mobile) */
  grid-template-columns: 1fr; /* Single column */

  /* For medium screens (e.g., tablets, smaller desktops) */
  @media (min-width: 600px) {
    /* Allow 1 or 2 columns, with minimum card width of 350px */
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }

  /* For larger screens (e.g., desktops), force 2 columns for "half screen" effect */
  @media (min-width: 992px) {
    grid-template-columns: repeat(
      2,
      1fr
    ); /* Two columns, each taking half the available space */
  }
`;

export const ReviewsTitle = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  color: ${Colors.darkSectionTitle};
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const WriteReviewButton = styled.button`
  background-color: ${Colors.primaryBlue};
  color: ${Colors.lightText};
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  align-self: center; /* Center the button */
  margin-top: 30px;

  &:hover {
    background-color: ${Colors.darkBlue};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
