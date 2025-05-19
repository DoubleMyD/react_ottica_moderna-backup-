import styled from 'styled-components';

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  background: #f7f7f7; 
`;

export const LoginForm = styled.form`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  width: 300px;
`;

export const LoginTitle = styled.h2`
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

export const LoginLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  color: #333;
`;

export const LoginInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 5px;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #0056b3;
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  background: #0056b3;
  border: none;
  padding: 12px;
  border-radius: 50px;
  cursor: pointer;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  color: white;
  font-size: 16px;
  margin-bottom: 20px;

  &:hover {
    background: #004999;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  text-align: center;
  margin: 0;
`;

export const RegistrationLink = styled.p`
  text-align: center;
  font-size: 14px;
  color: #0056b3;
  cursor: pointer;
  margin-top: -10px;

  &:hover {
    text-decoration: underline;
  }
`;

export const Loader = styled.div`
  color: #333;
  margin-bottom: 10px;
  font-size: 14px;
  text-align: center;
`;
