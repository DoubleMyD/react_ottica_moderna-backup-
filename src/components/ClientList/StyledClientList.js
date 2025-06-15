// Styled Components for Filter UI (can be moved to a shared styles file if preferred)
const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: ${Colors.lightBackground};
  border-radius: 10px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap; /* Allow wrapping on smaller screens */

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 10px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap; /* Allow wrapping for label/input groups */
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: ${Colors.darkText};
  font-size: 0.95em;
  white-space: nowrap; /* Prevent label from wrapping */
`;

const FilterInput = styled.input`
  padding: 10px 12px;
  border: 1px solid ${Colors.lightBorder};
  border-radius: 6px;
  font-size: 1rem;
  color: ${Colors.darkText};
  background-color: ${Colors.offWhite};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  flex-grow: 1; /* Allow input to take available space */
  min-width: 150px; /* Ensure input is not too small */

  &:focus {
    border-color: ${Colors.primaryBlue};
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    outline: none;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid ${Colors.lightBorder};
  border-radius: 6px;
  font-size: 1rem;
  color: ${Colors.darkText};
  background-color: ${Colors.offWhite};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  flex-grow: 1; /* Allow select to take available space */
  min-width: 150px; /* Ensure select is not too small */

  &:focus {
    border-color: ${Colors.primaryBlue};
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    outline: none;
  }
`;

const FilterButton = styled(AdminActionButton)`
  /* Custom style for filter buttons, inherits from AdminActionButton */
  flex-shrink: 0; /* Prevent button from shrinking */
  padding: 10px 20px;
`;
