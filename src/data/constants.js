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
    CATALOG_PRODUCT: "/catalogo/:productId",
    REGISTER: "/register",
    COMPLETE_PROFILE: "/completa-profilo",
    CONTACT: "/contatti",
    REVIEWS: "/recensioni",
    BRAND_STORY: "/brand-story",
    CLIENT_DASHBOARD: "/client-dashboard",
};