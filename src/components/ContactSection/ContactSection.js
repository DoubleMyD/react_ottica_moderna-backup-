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

// Dummy data for contact information
const contactInfo = {
  email: "info@yourshop.com",
  phone: "+39 012 3456789",
  address: "Via Roma, 123, 00100 Roma RM, Italia",
  // IMPORTANT: Replace this with your actual Google Maps embed URL
  // How to get this:
  // 1. Go to Google Maps (maps.google.com)
  // 2. Search for your address (e.g., "Via Roma, 123, Roma")
  // 3. Click the "Share" button (usually on the left sidebar)
  // 4. Go to the "Embed a map" tab
  // 5. Copy the HTML code provided. Extract only the 'src' value from the <iframe> tag.
  //    It will look something like "https://www.google.com/maps/embed?pb=..."
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4652.563508164816!2d16.668292994304636!3d41.185520597393456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1347fa63d36b9b61%3A0xdfa4785df036c3f1!2sOttica%20Visus%20Giovinazzo!5e1!3m2!1sit!2sit!4v1748340166990!5m2!1sit!2sit", 
};

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
