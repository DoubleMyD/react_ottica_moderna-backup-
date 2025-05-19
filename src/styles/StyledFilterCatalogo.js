import styled from "styled-components";

export const FilterCatalogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  width: 300px;
  background-color: #f8f9fa;
  border-right: 1px solid #eee;
`;

export const FilterCatalogoTitle = styled.h2`
  font-family: "Arial", sans-serif;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: left;
  font-size: 20px;
  color: #333;
`;

export const FilterGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

export const FilterLabel = styled.label`
  /* Nome più generico */
  display: block;
  margin-bottom: 8px;
  font-family: "Arial", sans-serif;
  font-size: 14px;
  color: #333;
  font-weight: bold;
`;

export const FilterInput = styled.input`
  /* Nome più generico */
  width: calc(100% - 22px);
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  font-family: "Arial", sans-serif;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #0056b3;
  }
`;

export const FilterCheckboxLabel = styled.label`
  /* Nome più generico per le checkbox */
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
  font-family: "Arial", sans-serif;
  font-size: 14px;
  color: #333;

  input[type="checkbox"] {
    margin-right: 8px;
  }
`;

export const FilterOptionsContainer = styled.div`
  /* Contenitore generico per le opzioni (checkbox, bottoni, ecc.) */
  display: flex;
  flex-direction: column; /* Disposizione predefinita a colonna */
  gap: 8px;
  margin-top: 10px;

  &.horizontal {
    /* Classe modificatore per disposizione orizzontale (es. tipologie a bottoni) */
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

export const FilterOptionButton = styled.button`
  /* Bottone generico per le opzioni */
  background-color: #eee;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px 12px;
  font-family: "Arial", sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #ddd;
  }

  &.active {
    background-color: #0056b3;
    color: white;
    border-color: #0056b3;
  }
`;

export const FilterCatalogoButton = styled.button`
  width: 100%;
  background: #0056b3;
  border: none;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Arial", sans-serif;
  font-weight: bold;
  color: white;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #004494;
  }
`;
