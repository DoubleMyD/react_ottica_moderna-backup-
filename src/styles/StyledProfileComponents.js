import styled from "styled-components";

export const ProfileFormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 20px;
`;

export const ProfileTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
`;

export const ProfileForm = styled.form`
  background: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
`;

export const ProfileLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
`;

export const ProfileInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #007bff;
  }

  /* Disabled styles */
  &:disabled {
    background-color: #e9ecef; /* Lighter background */
    cursor: not-allowed; /* No interaction cursor */
    opacity: 0.7; /* Slightly faded look */
  }
`;

export const ProfileButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }

  /* Disabled styles */
  &:disabled {
    background: #cccccc; /* Lighter gray for disabled */
    cursor: not-allowed; /* Indicate non-interactable */
    opacity: 0.7; /* Slightly faded look */
    &:hover {
      /* Override hover effect when disabled */
      background: #cccccc;
    }
  }
`;

// New styled components for error and loader messages
export const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9em;
  margin-bottom: 15px;
  text-align: center;
`;

export const Loader = styled.p`
  color: #007bff; /* Example color */
  font-size: 1em;
  margin-bottom: 15px;
  text-align: center;
`;
