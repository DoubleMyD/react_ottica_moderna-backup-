// src/layouts/MainLayout.jsx
import React from "react";
import styled from "styled-components"; // For styled components
import TopBar from "../TopBar/TopBar"; // Import your TopBar
import { Outlet } from "react-router-dom"; // From react-router-dom v6

// You might want to add some global styling or padding here
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.main`
  flex-grow: 1; /* Allows content to take up available space */
  padding-top: 60px; /* Adjust based on your TopBar's height to prevent content overlap */
  /* Add any other global padding or max-width for content here if needed */
`;

const MainLayout = () => {
  return (
    <LayoutContainer>
      <TopBar />
      <ContentWrapper>
        <Outlet /> {/* This is where the nested routes will be rendered */}
      </ContentWrapper>
      {/* You could add a Footer component here if you have one */}
    </LayoutContainer>
  );
};

export default MainLayout;
