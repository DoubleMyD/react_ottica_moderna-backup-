// src/components/ClientDashboard/ClientDashboardStyledComponents.js
import styled from "styled-components";
import { Colors } from "../styles/colors"; 

export const DashboardLayout = styled.div`
  display: flex;
  min-height: calc(100vh - 8vh); /* Full viewport height minus TopBar height */
  background-color: ${Colors.lightBackground}; /* Light background for the dashboard */
  font-family: "Arial", sans-serif;

  @media (max-width: 768px) {
    flex-direction: column; /* Stack sidebar and content on small screens */
  }
`;

export const Sidebar = styled.nav`
  width: 250px; /* Fixed width for sidebar */
  background-color: #ffffff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05); /* Subtle shadow on the right */
  padding: 20px 0; /* Vertical padding */
  display: flex;
  flex-direction: column;
  gap: 10px; /* Space between sidebar items */
  border-right: 1px solid ${Colors.lightBorder}; /* Separator */

  @media (max-width: 768px) {
    width: 100%; /* Full width on small screens */
    height: auto; /* Height adjusts to content */
    flex-direction: row; /* Items in a row */
    justify-content: space-around; /* Distribute items evenly */
    padding: 15px 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* Shadow on the bottom */
    border-right: none;
    border-bottom: 1px solid ${Colors.lightBorder};
  }
`;

export const SidebarItem = styled.button`
  background: none;
  border: none;
  padding: 12px 25px; /* Padding inside button */
  font-size: 1.1rem;
  font-weight: ${(props) => (props.$isActive ? "bold" : "normal")};
  color: ${(props) => (props.$isActive ? Colors.primaryBlue : Colors.darkText)};
  cursor: pointer;
  text-align: left; /* Align text to the left */
  transition: background-color 0.2s ease, color 0.2s ease;
  border-left: 4px solid
    ${(props) => (props.$isActive ? Colors.primaryBlue : "transparent")}; /* Active indicator */

  &:hover {
    background-color: ${Colors.lightBorder};
    color: ${Colors.darkBlue};
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    flex-grow: 1; /* Allow items to take available space */
    text-align: center; /* Center text when in a row */
    padding: 10px 15px;
    font-size: 0.95rem;
    border-left: none; /* No left border when stacked */
    border-bottom: 4px solid
      ${(props) => (props.$isActive ? Colors.primaryBlue : "transparent")}; /* Active indicator on bottom */
  }
`;

export const LogoutButton = styled(SidebarItem)`
  margin-top: auto; /* Pushes button to the bottom of the sidebar */
  color: ${Colors.errorRed}; /* Red color for logout */
  border-left: none; /* No active border for logout */
  border-bottom: none; /* No active border for logout on mobile */

  &:hover {
    background-color: ${Colors.errorRed};
    color: ${Colors.lightText};
  }

  @media (max-width: 768px) {
    margin-top: 0; /* Reset margin for row layout */
    border-bottom: none;
  }
`;

export const MainContent = styled.main`
  flex-grow: 1; /* Takes up remaining space */
  padding: 30px;
  overflow-y: auto; /* Allow content to scroll if it overflows */

  @media (max-width: 768px) {
    padding: 20px;
  }
`;
