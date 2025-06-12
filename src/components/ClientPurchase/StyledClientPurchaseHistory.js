// src/components/PurchaseHistorySection/PurchaseHistoryStyledComponents.js
import styled from "styled-components";
import { Link } from "react-router-dom"; // For product name link
import { Colors } from "../../styles/colors"; // Correct path to your Colors

export const HistoryContainer = styled.div`
  padding: 0; /* No padding on the container itself, controlled by parent MainContent */
  margin: 0;
  width: 100%;
  box-sizing: border-box; /* Include padding in width calculation */
`;

export const HistorySectionTitle = styled.h2`
  font-size: 2rem;
  color: ${Colors.darkSectionTitle};
  margin-bottom: 30px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.7rem;
    margin-bottom: 20px;
  }
`;

export const PurchaseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px; /* Space between individual purchase items */
`;

// --- Styles for a single PurchaseItem ---

export const PurchaseItemContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden; /* Ensures borders/shadows are contained */
`;

export const PurchaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${Colors.lightBackground};
  padding: 15px 25px;
  border-bottom: 1px solid ${Colors.lightBorder};

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    padding: 15px 15px;
  }
`;

export const HeaderDetail = styled.div`
  font-size: 0.95rem;
  color: ${Colors.darkGray};
  span {
    font-weight: bold;
    color: ${Colors.darkText};
  }

  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`;
export const ProductTableWrapper = styled.div`
  overflow-x: auto; /* Enable horizontal scroll for tables on small screens */
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */

  /* --- Scrollbar Styles --- */

  /* Webkit-specific scrollbar styling */
  &::-webkit-scrollbar {
    height: 8px; /* Height of the horizontal scrollbar */
    width: 8px; /* Width of the vertical scrollbar (though we're primarily targeting horizontal here) */
  }

  &::-webkit-scrollbar-track {
    background: ${Colors.lightGreyBackground}; /* Color of the track */
    border-radius: 10px; /* Rounded corners for the track */
  }

  &::-webkit-scrollbar-thumb {
    background: ${Colors.primaryBlue}; /* Color of the scroll thumb */
    border-radius: 10px; /* Rounded corners for the thumb */
    border: 2px solid ${Colors.lightGreyBackground}; /* Creates a slight padding/gap */
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: ${Colors.darkBlue}; /* Darker blue on hover */
  }

  /* Optional: Make the corners transparent if needed */
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

export const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse; /* Remove space between cells */
  background-color: #ffffff;

  th,
  td {
    padding: 15px 25px;
    text-align: left;
    border-bottom: 1px solid ${Colors.lightBorder}; /* Separator between rows */

    @media (max-width: 600px) {
      padding: 10px 15px;
      font-size: 0.9rem;
    }
  }

  th {
    background-color: ${Colors.lightGray};
    color: ${Colors.darkSectionTitle};
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.9rem;

    @media (max-width: 600px) {
      font-size: 0.8rem;
    }
  }

  td {
    color: ${Colors.darkText};
    vertical-align: middle; /* Vertically align content in cells */
  }

  /* Hide specific columns on smaller screens */
  @media (max-width: 600px) {
    th:nth-child(4), /* Unit Price */
    td:nth-child(4) {
      display: none;
    }
    th:nth-child(5), /* Actual Price */
    td:nth-child(5) {
      display: none;
    }
  }
`;

export const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px; /* Space between image and text */

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
`;

export const ProductNameLink = styled(Link)`
  display: flex; /* Use flex to align image and text */
  align-items: center;
  text-decoration: none;
  color: ${Colors.primaryBlue};
  font-weight: bold;

  &:hover {
    text-decoration: underline;
    color: ${Colors.darkBlue};
  }
`;

export const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  span.original-price {
    color: ${Colors.mediumGray};
    text-decoration: line-through;
    font-size: 0.85rem;
  }

  span.current-price {
    color: ${Colors.darkText};
    font-weight: bold;
    font-size: 1rem;
  }

  span.discounted-price {
    color: ${Colors.errorRed}; /* Or a specific discount color */
    font-weight: bold;
    font-size: 1rem;
  }
`;
