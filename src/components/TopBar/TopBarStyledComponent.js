// src/styles/TopBar/TopBarStyledComponent.js
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Colors } from "../../styles/colors";

export const TopBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 8vh;
  width: 100%;
  align-items: center;
  padding: 10px 20px;
  background-color: ${Colors.lightBackground};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const LogoImage = styled.img`
  height: 40px;
  width: auto;
  vertical-align: middle;
  border-radius: 4px;
`;

export const TitleContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  /* Ensure the base color of the text (h1) is set here, not on the Link directly if you want it static */
  /* Remove color: ${Colors.darkSectionTitle}; from here */
  cursor: pointer; /* <--- Keep cursor: pointer; */
  font-family: "Arial", sans-serif;
  padding: 5px 0;

  h1 {
    margin: 0;
    font-size: 1.8rem;
    color: ${Colors.darkSectionTitle}; /* <--- Set h1 color here, it won't change on hover now */
    /* Remove transition: color 0.2s ease; as it's no longer needed for color change */
  }

  &:hover {
    /* <--- REMOVE any color changes here */
    /* For example, remove:
    color: ${Colors.primaryBlue};
    h1 {
      color: ${Colors.primaryBlue};
    }
    */
    /* You could add a slight visual effect to the image on hover if desired, e.g.: */
    ${LogoImage} {
      /* Target the LogoImage specifically if it's within TitleContainer */
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }
  }
`;



export const PrimaryButton = styled(Link)`
  width: 15%;
  height: 100%;
  background: ${Colors.primaryBlue};
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Arial", sans-serif;
  font-weight: bold;
  color: ${Colors.lightText};
  font-size: 16px;
  border: none;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${Colors.darkBlue};
    transition: background-color 0.3s ease;
  }

  @media (max-width: 768px) {
    width: auto;
    padding: 8px 12px;
    font-size: 14px;
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background: ${Colors.mediumGray};
  width: 10%;

  &:hover {
    background-color: ${Colors.darkGray};
    transition: background-color 0.3s ease;
  }

  @media (max-width: 768px) {
    width: auto;
  }
`;
