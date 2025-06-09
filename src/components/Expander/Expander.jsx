// src/components/Expander/Expander.js
import React, { useState } from "react";
import {
  ExpanderContainer,
  ExpanderHeader,
  ExpanderLabel,
  ExpanderArrow,
  ExpanderContent,
} from "./StyledExpander";

const Expander = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ExpanderContainer>
      <ExpanderHeader onClick={toggleOpen}>
        <ExpanderLabel>{label}</ExpanderLabel>
        <ExpanderArrow className={isOpen ? "expanded" : ""}>
          {isOpen ? "▼" : "▶"}
        </ExpanderArrow>
      </ExpanderHeader>
      {/* Pass $isOpen here instead of isOpen */}
      <ExpanderContent $isOpen={isOpen}>{children}</ExpanderContent>
    </ExpanderContainer>
  );
};

export default Expander;