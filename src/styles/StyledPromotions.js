// src/styles/StyledPromotions.js
import styled from "styled-components";
import { Colors } from "./colors"; // Import your color palette

export const PromotionsPageContainer = styled.div`
  background-color: ${Colors.lightBackground};
  padding: 40px 20px;
  margin: 40px auto;
  max-width: 1200px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  font-family: "Inter", sans-serif; /* Using a more modern font as an example */
  color: ${Colors.darkText};
  display: flex;
  flex-direction: column;
  gap: 30px;

  @media (max-width: 768px) {
    padding: 20px 15px;
    margin: 20px auto;
  }
`;

export const PromotionsTitle = styled.h1`
  text-align: center;
  font-size: 3rem;
  color: ${Colors.darkSectionTitle};
  margin-bottom: 30px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 20px;
  }
`;

export const PromotionsTable = styled.div`
  display: grid;
  /* Define columns for Stato, Titolo, Descrizione, Data di inizio, Data di fine, Dettagli button */
  grid-template-columns: 0.8fr 1.5fr 3fr 1.2fr 1.2fr 0.8fr; /* Adjust column widths as needed */
  gap: 1px; /* To simulate table borders if using background color */
  background-color: ${Colors.lightBorder}; /* Light line color for dividers*/
  border-radius: 8px;
  overflow: hidden; /* Ensures rounded corners */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 992px) {
    grid-template-columns: 1fr; /* Stack columns on smaller screens */
    border-radius: 0; /* No rounded corners when stacked */
    box-shadow: none;
  }
`;

export const TableHeaderCell = styled.div`
  background-color: ${Colors.primaryBlue}; /**/
  color: ${Colors.lightText}; /**/
  padding: 15px 10px;
  font-weight: bold;
  text-align: center;
  font-size: 0.95rem;

  &:first-child {
    border-top-left-radius: 8px;
    @media (max-width: 992px) {
      border-top-left-radius: 0;
    }
  }
  &:last-child {
    border-top-right-radius: 8px;
    @media (max-width: 992px) {
      border-top-right-radius: 0;
    }
  }

  @media (max-width: 992px) {
    display: none; /* Hide headers on small screens, data will be labeled */
  }
`;

export const TableRow = styled.div`
  display: contents; /* Allows children to participate in the grid layout */

  @media (max-width: 992px) {
    display: flex;
    flex-direction: column;
    background-color: ${Colors.background}; /**/
    padding: 15px;
    border-bottom: 1px solid ${Colors.separatorSubtle}; /* Separator for stacked rows*/
    &:last-child {
      border-bottom: none;
    }
  }
`;

export const TableCell = styled.div`
  background-color: ${Colors.background}; /**/
  color: ${Colors.darkText}; /**/
  padding: 12px 10px;
  text-align: center;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* Prevent wrapping for single line cells like title */

  @media (max-width: 992px) {
    white-space: normal; /* Allow wrapping on small screens */
    text-align: left;
    &:before {
      /* Add labels for clarity in stacked view */
      content: attr(data-label) ": ";
      font-weight: bold;
      color: ${Colors.darkSectionTitle}; /**/
      margin-right: 5px;
    }
  }
`;

export const DescriptionCell = styled(TableCell)`
  white-space: normal; /* Allow description to wrap */
  text-align: left;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit description to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: 3.2em; /* Approx height for 2 lines based on font size/line-height */
`;

export const DetailsButton = styled.button`
  background-color: ${Colors.primaryBlue}; /* Using primary blue for consistency*/
  color: ${Colors.lightText}; /**/
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: bold;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${Colors.darkBlue}; /**/
  }

  @media (max-width: 992px) {
    margin-top: 15px;
    width: 100%;
  }
`;

export const NoPromotionsMessage = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: ${Colors.mediumGray}; /**/
  padding: 20px;
`;
