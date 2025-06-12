// src/styles/TopBar/TopBarStyledComponent.js
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Colors } from "../../styles/colors";

// --- Base Styled Component for Link-based Buttons ---
export const BaseLinkButton = styled(Link)`
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  box-sizing: border-box; /* Ensure padding is included in element's total width */

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 1024px) {
    padding: 8px 15px;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    flex-grow: 1;
    min-width: unset;
    max-width: 150px;
    padding: 8px 10px;
    font-size: 0.85rem;
  }
`;

// --- Main TopBar Layout Components ---
export const TopBarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 100%;
  padding: 0 40px;
  background-color: ${Colors.background};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
  font-family: "Inter", sans-serif;
  z-index: 1000;
  position: sticky;
  top: 0;
  box-sizing: border-box; /* CRITICAL: Ensures padding is included in the 100% width */
  max-width: 100vw; /* Ensure it never exceeds viewport width */
  overflow-x: hidden; /* Prevent horizontal scroll from this container itself if content somehow pushes it */

  @media (max-width: 1024px) {
    padding: 0 25px;
    height: 70px;
  }

  @media (max-width: 768px) {
    height: auto; /* Allow height to adjust if buttons wrap */
    min-height: 60px; /* Ensure a minimum height */
    padding: 10px 15px; /* Adjust padding for mobile when content wraps */
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
`;

export const TitleContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  cursor: pointer;
  padding: 8px 0;
  flex-shrink: 0;
  box-sizing: border-box; /* Important for consistency */

  h1 {
    margin: 0;
    font-size: 1.8rem;
    color: ${Colors.darkSectionTitle};
    font-weight: 700;
    white-space: nowrap;
  }

  @media (max-width: 1024px) {
    h1 {
      font-size: 1.6rem;
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.4rem;
    }
  }
`;

export const LogoImage = styled.img`
  height: 45px;
  width: auto;
  vertical-align: middle;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, opacity 0.2s ease;
  box-sizing: border-box; /* Important for consistency */

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    height: 35px;
  }
`;

export const NavButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  box-sizing: border-box; /* Important for consistency */

  @media (max-width: 1024px) {
    gap: 10px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 10px;
    padding: 0 5px; /* Add some small horizontal padding to keep buttons from touching edges on wrap */
  }
`;

export const PrimaryButton = styled(BaseLinkButton)`
  background: ${Colors.primaryBlue};
  color: ${Colors.lightText};

  &:hover {
    background-color: ${Colors.darkBlue};
  }
`;

export const SecondaryButton = styled(BaseLinkButton)`
  background: ${Colors.lightGray};
  color: ${Colors.darkText};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: ${Colors.darkGray};
    color: ${Colors.white};
  }
`;
