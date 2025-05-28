import styled from 'styled-components';
import { Colors } from '../styles/colors';
import { Link } from 'react-router-dom';

export const ButtonContainer = styled.div`
  margin-top: 50px; /* Space above the button */
  margin-bottom: 50px; /* Space below the button */
  text-align: center; /* Ensures the inline-block button is centered */
`;

export const CtaButton = styled(Link)`
  display: inline-block; /* Allows text-align to center it if parent is block */
  background-color: ${Colors.primaryBlue}; /* A nice blue, adjust as needed */
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none; /* Remove underline from Link */
  font-size: 1.1rem;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${Colors.hoverBlue}; /* Darker blue on hover */
    transform: translateY(-2px); /* Slight lift effect */
  }

  &:active {
    transform: translateY(0);
  }
`;
