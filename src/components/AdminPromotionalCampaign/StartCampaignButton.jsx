// src/components/Admin/Marketing/StartCampaignButton.jsx
import React from 'react';
import styled from 'styled-components';
import { Colors } from '../../styles/colors';

const StyledButton = styled.button`
  background-color: ${Colors.primaryBlue};
  color: ${Colors.white};
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${Colors.darkBlue};
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background-color: ${Colors.mediumGray};
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
    box-shadow: none;
  }
`;

const StartCampaignButton = ({ onClick, disabled = false, loading = false }) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled || loading}>
      {loading ? 'Preparazione Campagna...' : 'Avvia Campagna Promozionale'}
    </StyledButton>
  );
};

export default StartCampaignButton;