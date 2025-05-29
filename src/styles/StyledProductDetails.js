// src/components/ProductDetailPage/ProductDetailStyledComponents.js
import styled from "styled-components";
import { Colors } from "../styles/colors";

export const ProductDetailContainer = styled.div`
  background-color: #ffffff;
  padding: 40px;
  margin: 40px auto;
  max-width: 1000px; /* Max width for the content */
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  font-family: "Arial", sans-serif;
  color: ${Colors.darkText};
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative; /* <--- Add this for absolute positioning of back arrow */

  @media (max-width: 768px) {
    padding: 20px;
    margin: 20px auto;
  }
`;

// // NEW STYLED COMPONENT FOR BACK ARROW
export const BackArrowButton = styled.button`
  position: absolute; /* <--- Position absolutely within ProductDetailContainer */
  top: 20px; /* Adjust as needed */
  left: 20px; /* Adjust as needed */
  background: none;
  border: none;
  font-size: 2.5rem; /* Larger arrow */
  color: ${Colors.darkText};
  cursor: pointer;
  padding: 5px;
  line-height: 1; /* Ensure good vertical alignment for arrow character */
  transition: color 0.2s ease, transform 0.2s ease;
  z-index: 10; /* Ensure it's above other content */

  &:hover {
    color: ${Colors.primaryBlue};
    transform: translateX(-5px); /* Small slide effect on hover */
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    top: 10px;
    left: 10px;
  }
`;

export const ProductDetailHeader = styled.div`
  text-align: center;
  margin-top: 20px; /* Push content down slightly so arrow doesn't overlap title */

  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

export const ProductName = styled.h1`
  font-size: 2.8rem;
  color: ${Colors.darkSectionTitle};
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const ProductIdText = styled.p`
  font-size: 1rem;
  color: ${Colors.mediumGray};
`;

export const ProductContentWrapper = styled.div`
  display: flex;
  gap: 40px;
  align-items: flex-start;

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const ProductImageContainer = styled.div`
  flex: 1;
  min-width: 300px;
  text-align: center;

  @media (max-width: 992px) {
    width: 80%;
    min-width: unset;
  }
`;

export const ProductImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const ProductInfoContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 992px) {
    width: 100%;
    align-items: center;
    text-align: center;
  }
`;

export const ProductDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${Colors.darkText};
`;

export const ProductPrice = styled.p`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${Colors.primaryBlue};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

// The old BackButton might not be needed if the arrow is the primary navigation
// If you still want a textual button at the bottom, keep this.
// For now, I'm assuming the arrow replaces the need for this specific button.
export const BackButton = styled.button`
  background-color: ${Colors.mediumGray};
  color: ${Colors.lightText};
  border: none;
  padding: 12px 25px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s ease;
  align-self: flex-start;

  &:hover {
    background-color: ${Colors.darkGray};
  }

  @media (max-width: 992px) {
    align-self: center;
  }
`;


export const NotFoundMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: ${Colors.errorRed};
  margin-top: 50px;
`;
