// src/styles/StyledPromotionDetailsPage.js
import styled from "styled-components";
import { Colors } from "./colors";

export const PromotionDetailPageContainer = styled.div`
  background-color: ${Colors.lightBackground};
  padding: 40px 20px;
  margin: 40px auto;
  max-width: 1000px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  font-family: "Inter", sans-serif;
  color: ${Colors.darkText};
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative; /* For back button positioning */

  @media (max-width: 768px) {
    padding: 20px 15px;
    margin: 20px auto;
  }
`;

export const BackArrowButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 2.5rem;
  color: ${Colors.darkText};
  cursor: pointer;
  padding: 5px;
  line-height: 1;
  transition: color 0.2s ease, transform 0.2s ease;
  z-index: 10;

  &:hover {
    color: ${Colors.primaryBlue};
    transform: translateX(-5px);
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    top: 10px;
    left: 10px;
  }
`;

export const PromotionHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding-top: 30px; /* Space for back button */

  @media (max-width: 768px) {
    padding-top: 20px;
  }
`;

export const PromotionTitle = styled.h1`
  font-size: 3.2rem;
  color: ${Colors.darkSectionTitle};
  margin-bottom: 10px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const PromotionMeta = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;
  font-size: 1.1rem;
  color: ${Colors.mediumGray};
  margin-top: 10px;
  flex-wrap: wrap; /* Allow wrapping on small screens */

  & > span {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    gap: 15px;
  }
`;

export const PromotionDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${Colors.darkText};
  text-align: center;
  margin-top: 25px;
  padding: 0 15px;
`;

export const ProductsInPromotionSection = styled.div`
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid ${Colors.separatorSubtle};
`;

export const ProductsInPromotionTitle = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  color: ${Colors.darkSectionTitle};
  margin-bottom: 30px;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(250px, 1fr)
  ); /* Responsive grid for products */
  gap: 30px;
  justify-content: center;

  @media (max-width: 600px) {
    grid-template-columns: 1fr; /* Single column on very small screens */
  }
`;

export const ProductCard = styled.div`
  background-color: ${Colors.background};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const ProductImage = styled.img`
  max-width: 100%;
  height: 150px; /* Fixed height for consistency */
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 15px;
`;

export const ProductName = styled.h3`
  font-size: 1.1rem;
  color: ${Colors.darkText};
  margin-bottom: 5px;
  font-weight: 600;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%; /* Ensure it respects parent width */
`;

export const ProductApplicationDetails = styled.p`
  font-size: 0.95rem;
  color: ${Colors.mediumGray};
  margin-top: 5px;
  line-height: 1.4;
`;

export const NoProductsMessage = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: ${Colors.mediumGray};
  padding: 20px;
`;

export const NotFoundMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: ${Colors.errorRed};
  margin-top: 50px;
`;

export const Loader = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: ${Colors.mediumGray};
  padding: 50px;
`;
