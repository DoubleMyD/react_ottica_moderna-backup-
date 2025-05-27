import styled from "styled-components";

export const TopBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 8vh;
  width: 100%;
  align-items: center;
  padding: 10px;
  background-color: #f8f9fa;
`;

export const TitleContainer = styled.button`
  width: 30%;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f7f7f7;
`;

export const PrimaryButton = styled.button`
  width: 15%;
  height: 100%;
  background: #0056b3;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Arial", sans-serif;
  font-weight: bold;
  color: white;
  font-size: 16px;
  border: none;
  &:hover {
    background-color: #004494; /* Darker shade on hover */
    transition: background-color 0.3s ease; /* Smooth transition */
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background: #6c757d;
  width: 10%;

  &:hover {
    background-color: #5a6268; /* Darker shade on hover */
    transition: background-color 0.3s ease; /* Smooth transition */
  }
`;
