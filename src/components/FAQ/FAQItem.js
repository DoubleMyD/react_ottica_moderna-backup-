// src/components/FAQItem.jsx
import React from "react";
// Import your existing Expander component
import Expander from "../Expander/Expander"; // Make sure this path is correct for your Expander
import {
  FAQItemWrapper,
  FAQQuestionLabel, // We'll use this for styling the combined label
  FAQAnswerContent,
} from "../FAQ/StyledFAQ";

const FAQItem = ({ faq, index }) => {
  // Combine the number and question into a single label string
  const combinedLabel = `${index + 1}. ${faq.question}`;

  return (
    <FAQItemWrapper>
      {/* Pass the combinedLabel to your Expander component's label prop */}
      <Expander label={<FAQQuestionLabel>{combinedLabel}</FAQQuestionLabel>}>
        {/* Children of Expander become the collapsible content */}
        <FAQAnswerContent>
          <p>{faq.answer}</p>
        </FAQAnswerContent>
      </Expander>
    </FAQItemWrapper>
  );
};

export default FAQItem;
