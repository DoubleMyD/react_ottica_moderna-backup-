// src/styles/StyledClientTypesList.js
import styled from "styled-components";
import { Colors } from "../../styles/colors";

export const ClientTypesListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 90vw;
`;

export const ClientTypesTable = styled.div`
  display: grid;
  /* Define the columns explicitly for ClientTypesList */
  grid-template-columns: 0.5fr 1fr 1.5fr 1.5fr 1fr 1.2fr; /* Example: Adjust these values as needed */
  gap: 1px;
  background-color: ${Colors.lightBorder};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow-x: auto; /* Keep this for horizontal scrolling if content overflows */

  /* Media query for smaller screens: stack columns vertically */
  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* On small screens, stack columns vertically */
  }
`;

export const ClientTypesTableHeaderCell = styled.div`
  background-color: ${Colors.primaryBlue};
  color: ${Colors.lightText};
  padding: 15px 10px;
  font-weight: bold;
  text-align: center;
  font-size: 0.95rem;

  &:first-child {
    border-top-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
  }

  /* Hide table headers on small screens if you're using data-label for mobile view */
  @media (max-width: 768px) {
    display: none;
  }
`;

export const ClientTypesTableRow = styled.div`
  display: contents; /* Ensures grid items flow directly into the parent grid */

  /* For mobile, display rows as flex columns */
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px; /* Space between "rows" on mobile */
    border: 1px solid ${Colors.lightBorder};
    border-radius: 8px;
    overflow: hidden;
  }
`;

export const ClientTypesTableCell = styled.div`
  background-color: ${Colors.background};
  color: ${Colors.darkText};
  padding: 12px 10px;
  text-align: center;
  font-size: 0.9rem;
  word-wrap: break-word; /* Allows long words to break and wrap */
  white-space: normal; /* Allows text to wrap naturally */
  min-width: 80px; /* Added min-width to prevent extreme squeezing in grid */

  /* Mobile specific styling for cells */
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    padding: 10px 15px;
    border-bottom: 1px solid ${Colors.separatorSubtle};

    &:last-child {
      border-bottom: none;
    }

    /* Show data-label as a pseudo-element for mobile */
    &::before {
      content: attr(data-label);
      font-weight: bold;
      color: ${Colors.mediumGray};
      margin-right: 10px;
      min-width: 120px; /* Give space for the label */
      flex-shrink: 0;
    }
  }

  /* For the cell containing multiple buttons (if re-added in future) */
  div {
    display: flex;
    gap: 5px; /* Space between buttons */
    justify-content: center;
    align-items: center;
    flex-wrap: wrap; /* Allow buttons to wrap if too many */

    @media (max-width: 768px) {
      justify-content: flex-end; /* Align buttons to the right on mobile */
      flex-grow: 1; /* Allow buttons to take remaining space */
    }
  }
`;

export const ClientTypesActionButton = styled.button`
  background-color: ${Colors.primaryBlue};
  color: ${Colors.lightText};
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${Colors.darkBlue};
  }

  ${(props) =>
    props.$delete &&
    `
    background-color: ${Colors.errorRed};
    &:hover {
      background-color: #c82333;
    }
  `}
`;

export const ClientTypesMessage = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: ${Colors.mediumGray};
  padding: 20px;
`;

export const DetailsSection = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed ${Colors.mediumGray};

  &:first-child {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }

  h4 {
    color: ${Colors.darkSectionTitle};
    font-size: 1rem;
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

export const NoDetailsMessage = styled.p`
  font-style: italic;
  color: ${Colors.mediumGray};
  font-size: 0.9rem;
  margin-top: 5px;
`;

export const AssociatedListItem = styled.li`
  background-color: ${Colors.lightBackground};
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: ${Colors.darkText};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${Colors.separatorSubtle};
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background-color: ${Colors.background};
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const AssociatedItemContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;
  gap: 3px;
`;

export const AssociatedItemTitle = styled.span`
  font-weight: bold;
  color: ${Colors.primaryBlue};
  font-size: 1rem;
`;

export const AssociatedItemDetails = styled.span`
  color: ${Colors.mediumGray};
  font-size: 0.85rem;
`;

export const AssociatedItemAction = styled.button`
  background: none;
  border: 1px solid ${Colors.primaryBlue};
  color: ${Colors.primaryBlue};
  font-weight: bold;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.2s ease, color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background-color: ${Colors.primaryBlue};
    color: ${Colors.lightText};
    border-color: ${Colors.primaryBlue};
  }
`;


