// src/styles/FAQStyledComponents.js
import styled from "styled-components";

export const FAQListContainer = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 40px auto; /* Center the list on the page */
  font-family: "Arial", sans-serif;
`;

export const FAQItemWrapper = styled.div`
  margin-bottom: 15px; /* Spacing between each FAQ item */
  /* Your ExpanderContainer itself has margin-bottom: 15px, so this might be redundant.
     You might need to adjust margin on ExpanderContainer or here. */
`;

// This will be the content that goes into Expander's label prop
export const FAQQuestionLabel = styled.span`
  /* This style will be applied to the combined number and question text */
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  /* Add any specific styling for the combined label here */
`;

export const FAQAnswerContent = styled.div`
  padding: 15px; /* Consistent padding inside the expanded answer */
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  border-top: 1px dashed #eee; /* Light separator for answer from header */
`;
