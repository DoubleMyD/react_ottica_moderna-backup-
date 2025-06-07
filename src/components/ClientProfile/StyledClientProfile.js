// src/components/ClientProfileSection/ClientProfileStyledComponents.js
import styled from "styled-components";
import { Colors } from "../../styles/colors";

export const ProfileContainer = styled.div`
  background-color: #ffffff; /* Card background */
  padding: 30px; /* Inner padding for the card */
  margin: 0; /* Remove fixed margins, let parent container handle spacing */
  width: 100%; /* Take full available width of its parent */
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  font-family: "Arial", sans-serif;
  color: ${Colors.darkText};
  box-sizing: border-box; /* Include padding in width */

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const ProfileSectionTitle = styled.h2`
  font-size: 2rem;
  color: ${Colors.darkSectionTitle};
  margin-bottom: 30px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.7rem;
    margin-bottom: 20px;
  }
`;

export const ProfileContentWrapper = styled.div`
  display: flex;
  gap: 40px; /* Space between the form part and the controls part */
  align-items: flex-start; /* Align top of form and controls */

  @media (max-width: 992px) {
    /* Adjust breakpoint for stacking */
    flex-direction: column; /* Stack columns on smaller screens */
    align-items: center; /* Center items when stacked */
    gap: 30px;
  }
`;

export const FormSection = styled.div`
  flex: 2; /* Gives more space to the form fields (e.g., 66% width) */
  min-width: 0; /* Allow flex item to shrink */

  @media (max-width: 992px) {
    flex: none; /* Reset flex on smaller screens */
    width: 100%; /* Take full width when stacked */
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr; /* Label (auto-width), Input (takes rest) */
  gap: 20px 15px; /* Row gap, Column gap */
  align-items: center; /* Vertically align items in the grid cells */

  /* No need for grid-template-areas here as it's a simple 2-column grid */
  /* Remove specific grid-area assignments from Label/Input if they were still there. */

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack label and input vertically */
    gap: 10px; /* Adjust gap for stacked layout */
  }
`;

export const FormFieldGroup = styled.div`
  display: contents; /* Allows child elements to participate in grid without being a grid item themselves */
  /* The labels and inputs will directly be grid items */
`;

export const Label = styled.label`
  font-size: 1rem;
  font-weight: bold;
  color: ${Colors.darkText};
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-right: 10px; /* Space between label and input */

  @media (max-width: 768px) {
    text-align: left; /* Align labels left when stacked */
    padding-right: 0;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${Colors.borderColor};
  border-radius: 4px;
  font-size: 1rem;
  color: ${Colors.darkText};
  background-color: ${(props) =>
    props.readOnly ? Colors.lightBackground : "#fff"};
  cursor: ${(props) => (props.readOnly ? "default" : "text")};
  box-sizing: border-box;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${Colors.primaryBlue};
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const ControlsSection = styled.div`
  flex: 1; /* Takes less space than the form (e.g., 33% width) */
  display: flex;
  flex-direction: column;
  gap: 20px; /* Space between button group and newsletter toggle */
  align-items: flex-end; /* Align buttons and newsletter toggle to the right */

  @media (max-width: 992px) {
    flex: none; /* Reset flex on smaller screens */
    width: 100%; /* Take full width when stacked */
    align-items: center; /* Center items when stacked */
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column; /* Stack buttons vertically */
  gap: 10px;

  @media (max-width: 992px) {
    flex-direction: row; /* Buttons side-by-side on smaller stacked layout */
    justify-content: center;
    width: 100%;
  }
`;

export const ProfileButton = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease, transform 0.1s ease;
  min-width: 120px; /* Ensure consistent button width */

  background-color: ${Colors.primaryBlue};
  color: ${Colors.lightText};

  &:hover {
    background-color: ${Colors.darkBlue};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &.cancel {
    background-color: ${Colors.mediumGray};
    &:hover {
      background-color: ${Colors.darkGray};
    }
  }

  @media (max-width: 992px) {
    flex-grow: 1; /* Allow buttons to expand in row layout */
    min-width: unset; /* Remove min-width when flexible */
  }
`;

export const NewsletterToggleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end; /* Align to the right */

  @media (max-width: 992px) {
    justify-content: center; /* Center when stacked */
  }
`;

export const NewsletterLabel = styled.label`
  font-size: 1rem;
  font-weight: bold;
  color: ${Colors.darkText};
  white-space: nowrap;
`;

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  /* Basic checkbox styling */
  appearance: none; /* Hide default browser checkbox */
  width: 20px;
  height: 20px;
  border: 2px solid ${Colors.primaryBlue};
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s, border-color 0.2s;
  flex-shrink: 0; /* Prevent it from shrinking in flex containers */

  &:checked {
    background-color: ${Colors.primaryBlue};
    border-color: ${Colors.primaryBlue};
  }

  &:checked::before {
    content: "✔"; /* Checkmark icon */
    display: block;
    color: white;
    font-size: 14px;
    line-height: 18px; /* Adjust to vertically center checkmark */
    text-align: center;
  }

  &:disabled {
    /* Styles for when the checkbox is disabled */
    opacity: 0.7; /* Make it slightly transparent to show it's inactive */
    cursor: not-allowed;
    background-color: ${Colors.lightBorder}; /* Light gray background */
    border-color: ${Colors.mediumGray}; /* Medium gray border */

    &:checked {
      /* Styles when disabled AND checked (e.g., if it was checked before disabling) */
      background-color: ${Colors.mediumGray}; /* Muted background */
      border-color: ${Colors.mediumGray};
      /* Checkmark color might also need to be muted or a different color */
      &::before {
        color: ${Colors.lightText}; /* Keep checkmark visible but muted */
      }
    }
  }
`;

// New styled components for error and loader messages (from previous turn)
export const ErrorMessage = styled.p`
  color: ${Colors.errorRed};
  font-size: 0.9em;
  width: 20%;
  margin-bottom: 15px;
  text-align: center;
  font-weight: bold;
`;

export const Loader = styled.p`
  color: ${Colors.primaryBlue};
  font-size: 1em;
  margin-bottom: 15px;
  text-align: center;
  font-weight: bold;
`;

