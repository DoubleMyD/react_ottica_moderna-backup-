import styled from "styled-components";

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
  position: relative; /* Necessario per il posizionamento assoluto di prezzo e brand */
`;

export const ProductImagePlaceholder = styled.div`
  background-color: #f0f0f0;
  aspect-ratio: 1 / 1; /* Mantiene le proporzioni quadrate */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #777;
`;

export const ProductBrand = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px 8px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  z-index: 1; /* Assicura che sia sopra l'immagine */
`;

export const ProductPrice = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px 8px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  color: #007bff;
  z-index: 1; /* Assicura che sia sopra l'immagine */
`;

export const ProductAction = styled.div`
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center; /* Manteniamo l'allineamento verticale al centro */
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