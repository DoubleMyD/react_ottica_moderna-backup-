import styled from 'styled-components';

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
`;

export const ShippingOptions = styled.div`
  margin-top: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
`;

export const ShippingOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  background: #f9f9f9;
  border-bottom: 1px solid #ddd;

  &:hover {
    background: #e9ecef;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const ShippingPrice = styled.span`
  font-size: 16px;
  font-weight: bold;
`;