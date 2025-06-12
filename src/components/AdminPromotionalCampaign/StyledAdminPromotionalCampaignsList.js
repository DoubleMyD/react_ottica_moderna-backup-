// src/styles/StyledPromotionalCampaignsList.js
import styled from "styled-components";
import { Colors } from "../../styles/colors";

export const CampaignsContainer = styled.div`
  padding: 30px;
  background-color: ${Colors.background};
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  font-family: "Inter", sans-serif;
  color: ${Colors.darkText};

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

export const TopControls = styled.div`
  display: flex;
  justify-content: flex-end; /* Pushes the button to the right */
  margin-bottom: 30px; /* Space below the controls */

  @media (max-width: 768px) {
    justify-content: center; /* Center button on small screens */
    margin-bottom: 20px;
  }
`;

export const NewCampaignButton = styled.button`
  background-color: ${Colors.primaryBlue};
  color: ${Colors.white};
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${Colors.darkBlue};
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

export const CampaignsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(300px, 1fr)
  ); /* Responsive grid */
  gap: 30px; /* Space between cards */

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack cards on very small screens */
    gap: 20px;
  }
`;

export const CampaignCard = styled.div`
  background-color: ${Colors.white};
  border: 1px solid ${Colors.lightBorder};
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Pushes button to bottom */
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

export const CampaignTitle = styled.h3`
  font-size: 1.5rem;
  color: ${Colors.darkSectionTitle};
  margin-bottom: 15px;
  font-weight: 700;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 1px solid ${Colors.separatorSubtle}; /* Subtle separator */
`;

export const CampaignDetails = styled.div`
  flex-grow: 1; /* Allows content to push button to bottom */
  margin-bottom: 20px;

  h4 {
    font-size: 1rem;
    color: ${Colors.mediumGray};
    margin-bottom: 10px;
    font-weight: 500;
  }
`;

export const ClientTypesInvolvedList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px; /* Space between client type tags */
  justify-content: center; /* Center the tags */
`;

export const ClientTypeTag = styled.li`
  background-color: ${Colors.accentGreen};
  color: ${Colors.white};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${Colors.mediumGray};
    transform: translateY(-1px);
    cursor: pointer;
  }
`;
export const CampaignActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between; /* Pushes children to ends */
  align-items: center; /* Vertically centers children */
  width: 100%; /* Ensures it takes full width of its parent */
  margin-top: 15px; /* Add some space above the buttons if needed */
  padding: 0 5px; /* Optional: small padding to prevent buttons touching edges */

  @media (max-width: 768px) {
    flex-direction: column; /* Stack buttons vertically on small screens */
    gap: 10px; /* Space between stacked buttons */
    padding: 0;
  }
`;

// Also, you might want to adjust CampaignActionButton.
// Remove `width: 100%` and `align-self: center` from CampaignActionButton
// as its parent `CampaignActionsWrapper` will now handle positioning.
// Keep `max-width` to control individual button size.
export const CampaignActionButton = styled.button`
  background-color: ${Colors.secondaryBlue};
  color: ${Colors.white};
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  /* Removed align-self: center; */
  transition: background-color 0.2s ease, transform 0.2s ease;
  /* Removed width: 100%; */
  max-width: 150px; /* Maintain individual button max-width */
  /* Removed margin-top: 15px; (now handled by CampaignActionsWrapper) */

  &:hover {
    background-color: ${Colors.darkBlue};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const PlaceholderText = styled.p`
  text-align: center;
  color: ${Colors.mediumGray};
  font-style: italic;
  padding: 30px;
`;
