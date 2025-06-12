// src/styles/StyledAdminDashboard.js
import styled from "styled-components";
import { Colors } from "./colors";

export const AdminDashboardContainer = styled.div`
  display: flex;
  min-height: 100vh; /* Full viewport height */
  background-color: ${Colors.lightBackground};
  font-family: "Inter", sans-serif;
  color: ${Colors.darkText};
`;

export const AdminSidebar = styled.div`
  width: 250px; /* Fixed width for the sidebar */
  background-color: ${Colors.darkSectionTitle}; /* Dark background for sidebar */
  color: ${Colors.lightText};
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: sticky; /* Sticky sidebar */
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto; /* Enable scrolling if content overflows */

  @media (max-width: 992px) {
    width: 180px; /* Adjust for smaller screens */
    padding: 15px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    min-height: unset;
    flex-direction: row;
    justify-content: space-around;
    padding: 10px 0;
    position: static;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
`;

export const SidebarProfileImage = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${Colors.mediumGray}; /* Placeholder background */
  border-radius: 50%;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid ${Colors.primaryBlue}; /* Border accent */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    display: none; /* Hide image on mobile sidebar */
  }
`;

export const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
`;

export const SidebarButton = styled.button`
  background-color: transparent;
  color: ${Colors.lightText};
  border: 1px solid ${Colors.mediumGray}; /* Subtle border */
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background-color 0.2s ease, border-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background-color: ${Colors.primaryBlue};
    border-color: ${Colors.primaryBlue};
    color: ${Colors.background};
  }

  ${(props) =>
    props.$active &&
    ` /* Changed to $active */
    background-color: ${Colors.primaryBlue};
    border-color: ${Colors.primaryBlue};
    color: ${Colors.background};
    font-weight: 600;
  `}

  @media (max-width: 768px) {
    flex: 1 1 auto; /* Allow buttons to grow/shrink */
    min-width: 100px;
    max-width: 150px;
    text-align: center;
    padding: 8px 10px;
    font-size: 0.9rem;
  }
`;

export const AdminMainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

export const AdminHeader = styled.header`
  background-color: ${Colors.background};
  padding: 20px 30px;
  border-bottom: 1px solid ${Colors.lightBorder};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px; /* Space between header and content */

  @media (max-width: 768px) {
    padding: 15px 20px;
    flex-direction: column;
    gap: 10px;
    text-align: center;
    margin-bottom: 20px;
  }
`;

export const AdminContentArea = styled.div`
  background-color: ${Colors.background};
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  flex-grow: 1; /* Allows it to take up available space */

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const AdminSectionControls = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
  }
`;

export const AdminActionButton = styled.button`
  background-color: ${Colors.primaryBlue};
  color: ${Colors.lightText};
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: ${Colors.darkBlue};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  ${(props) =>
    props.$secondary &&
    ` /* Changed to $secondary */
    background-color: ${Colors.mediumGray};
    &:hover {
      background-color: ${Colors.darkGray};
    }
  `}

  @media (max-width: 768px) {
    padding: 8px 15px;
    font-size: 0.85rem;
  }
`;

export const AdminSectionTitle = styled.h2`
  font-size: 2rem;
  color: ${Colors.darkSectionTitle};
  margin-bottom: 20px;
  text-align: center;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 15px;
  }
`;
