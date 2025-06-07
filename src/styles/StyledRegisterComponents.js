import styled from "styled-components";

export const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f7f7f7;
`;

export const RegisterForm = styled.form`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 400px;
`;

export const RegisterTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
`;

export const RegisterLabel = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
`;

export const RegisterInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 15px;

  &:focus {
    border-color: #0056b3;
    outline: none;
  }

  /* Disabled styles for input */
  &:disabled {
    background-color: #e9ecef; /* Lighter background */
    cursor: not-allowed; /* No interaction cursor */
    opacity: 0.7; /* Slightly faded look */
  }
`;

export const RegisterSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 15px;

  &:focus {
    border-color: #0056b3;
    outline: none;
  }

  /* Disabled styles for select */
  &:disabled {
    background-color: #e9ecef; /* Lighter background */
    cursor: not-allowed; /* No interaction cursor */
    opacity: 0.7; /* Slightly faded look */
  }
`;

export const RegisterCheckbox = styled.div`
  margin-bottom: 10px;

  input {
    margin-right: 5px;
  }

  span {
    font-size: 14px;
  }
`;

export const RegisterButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #0056b3;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #004999;
  }

  /* Disabled styles for button */
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

// Add these new styled components if they are not already there
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
