// src/components/ElencoProdotti/StyledElencoProdotti.js
import styled from "styled-components";
import { Colors } from "../../styles/colors";

export const ProductListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    250px
  ); /* Adjust 250px to your desired fixed width */
  gap: 20px;
  padding: 20px;
  flex-grow: 1;
  align-items: start;
`;

export const ProductCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const ProductImage = styled.img`
  width: 100%;
  height: auto; /* Maintain aspect ratio */
  aspect-ratio: 1 / 1; /* Keep square proportions if desired */
  object-fit: cover; /* Cover the area, cropping if necessary */
  background-color: #f0f0f0; /* Fallback background for missing images */
`;

// NEW: ProductInfo styled component
export const ProductInfo = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex-grow: 1; // Allows product info to take available space
`;

export const ProductName = styled.h3`
  font-size: 16px;
  margin: 0 0 5px 0; /* Adjust margins as needed */
  color: #333;
  text-align: center;
`;

export const ProductBrand = styled.span`
  position: absolute; /* Keep it positioned relative to ProductCard */
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px 8px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  z-index: 1;
`;

export const ProductPrice = styled.span`
  position: absolute; /* Keep it positioned relative to ProductCard */
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px 8px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  color: #007bff;
  z-index: 1;
`;

export const ProductAction = styled.div`
  padding: 10px;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-top: auto; /* Pushes the action button to the bottom */
`;

export const ViewButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// --- NEW STYLED COMPONENTS FOR ADMIN ACTIONS ---
export const AdminActionsContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px; /* Space between icons */
  z-index: 10; /* Ensure they are above other elements */
`;

export const AdminActionButton = styled.button`
  background-color: ${Colors.lightGray}; /* Subtle background for actions */
  color: ${Colors.darkText}; /* Dark text for icons */
  border: none;
  border-radius: 5px;
  padding: 6px 8px; /* Padding for the icons */
  font-size: 1.1rem; /* Size of the icon */
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease, transform 0.2s ease, color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background-color: ${Colors.mediumGray};
    color: ${Colors.white};
  }

  ${props => props.$delete && ` /* Prop for delete button specific styles */
    background-color: ${Colors.accentRed};
    color: ${Colors.white};
    &:hover {
      background-color: #C82333; /* Darker red on hover */
      color: ${Colors.white};
    }
  `}
`;

// --- NEW STYLED COMPONENTS FOR PROMOTION-SPECIFIC PRODUCT DETAILS ---
export const ProductPromoDetails = styled.div`
  width: 90%;
  background-color: ${Colors.offWhite};
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 15px; /* Space before ProductAction */
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px dashed ${Colors.lightBorder};
  text-align: left; /* Align text within this block to left */
`;

export const PromoDetailItem = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${Colors.darkText};
  display: flex;
  justify-content: space-between; /* Space out label and value */
  align-items: center;

  span {
    color: ${Colors.mediumGray};
    font-weight: 500;
  }

  strong {
    color: ${Colors.primaryBlue};
    font-weight: 700;
  }
`;

