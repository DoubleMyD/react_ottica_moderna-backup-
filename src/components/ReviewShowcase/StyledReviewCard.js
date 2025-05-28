import styled from "styled-components";
import { Colors } from "../../styles/colors";

export const ReviewCardContainer = styled.div`
  background-color: #ffffff; /* White background for the card */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 10px; /* Spacing around the card, handled by Swiper's gap if needed or outer padding */
  height: auto; /* Allow height to adjust to content */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box; /* Include padding and border in the width */

  /* Swiper will manage the width of slides based on its configuration */
  /* Remove width: calc((100% / 3) - 20px); or similar hardcoded width */
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
