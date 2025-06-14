export const APP_URL = "http://localhost:3000";

export class Role {
    static ADMIN = "Amministratore";
    static CLIENT = "Authenticated";
    static USER = "Public";
};

export const Pages = {
    HOME: "/",
    LOGIN: "/login",
    ADMIN: "/admin",
    CATALOG: "/catalogo",
    REGISTER: "/register",
    COMPLETE_PROFILE: "/completa-profilo",
    PROMOTIONS: "/promotions",
    CONTACT: "/contatti",
    REVIEWS: "/recensioni",
    BRAND_STORY: "/brand-story",
    CLIENT_DASHBOARD: "/client-dashboard",
    FAQs: "/faqs",
    CLIENT_DETAIL: "/client-details",
    PROMOTION_DETAIL: "/promotion-detail",
};

// src/utils/AdminSection.js

export const AdminSection = {
  Dashboard_Overview: "overview",
  Profilazione_TipologieCliente: "tipologieCliente",
  Profilazione_ElencoClienti: "elencoClienti",
  PromotionalCampaigns: "promotional-campaigns",
  Prodotti: "products",
  // Add other main sections here as needed
};
  
