import styled from "styled-components";

export const ExpanderContainer = styled.div`
  margin-bottom: 15px;
  width: 100%;
`;

export const ExpanderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  cursor: pointer;
`;

export const ExpanderLabel = styled.span`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #333;
  font-weight: bold;
`;

export const ExpanderArrow = styled.span`
  font-size: 16px;
  color: #777;
  transition: transform 0.2s ease-in-out;

  &.expanded {
    transform: rotate(90deg); /* Ruota la freccia quando è espansa */
  }
`;

export const ExpanderContent = styled.div`
  margin-top: 10px;
  overflow: hidden; /* Importante per l'animazione di altezza */
  max-height: ${(props) =>
    props.isOpen ? "500px" : "0"}; /* Altezza massima quando aperto */
  transition: max-height 0.3s ease-in-out;
`;
