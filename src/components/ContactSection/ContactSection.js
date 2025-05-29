// src/components/ShopContactSection.jsx
import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

import {
  ContactContainer,
  ContactContentWrapper,
  ContactInfoSection,
  SectionTitle,
  ContactLine,
  MapContainer, // <--- Import the new MapContainer
} from "../ContactSection/StyledContactSection";

import { contactInfo } from "../../data/test/dummyContactInfo"; // Import your contact info data

const ShopContactSection = () => {
  return (
    <ContactContainer>
      <SectionTitle>Contatti e Dove Trovarci</SectionTitle>{" "}
      {/* Updated title */}
      <ContactContentWrapper>
        <ContactInfoSection>
          <ContactLine>
            <FaEnvelope />{" "}
            <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
          </ContactLine>
          <ContactLine>
            <FaPhone />{" "}
            <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}>
              {contactInfo.phone}
            </a>
          </ContactLine>
          <ContactLine>
            <FaMapMarkerAlt /> {contactInfo.address}
          </ContactLine>
        </ContactInfoSection>

        {/* Google Map Section */}
        <MapContainer>
          <iframe
            src={contactInfo.mapEmbedUrl}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map of Our Location"
          ></iframe>
        </MapContainer>
      </ContactContentWrapper>
    </ContactContainer>
  );
};

export default ShopContactSection;
