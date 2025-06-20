// src/components/FAQList.jsx
import React from "react";
import FAQItem from "../FAQ/FAQItem";
import { FAQListContainer } from "../FAQ/StyledFAQ"; 

const FAQList = ({ faqs, showTitle = true }) => {
  
  return (
    <FAQListContainer>
      {showTitle && <h2>Domande Frequenti (FAQ)</h2>}

      {faqs.map((faq, index) => (
        
        <FAQItem key={faq.id} faq={faq} index={index} />
      ))
      }
    </FAQListContainer>
  );
};

export default FAQList;
