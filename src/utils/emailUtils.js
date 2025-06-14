// src/utils/emailUtils.js
// Ensure STRAPI_BASE_URL points to your Strapi instance's root, e.g., "http://localhost:1337"
// and Pages.CATALOG is like "/catalog"

import { STRAPI_BASE_URL } from "../data/api";
import { APP_URL, Pages } from "../data/constants";

/**
 * Generates the text content for a promotional email.
 * This function focuses on a plain text format for now, but could be extended to HTML.
 *
 * @param {object} promotion - The full promotion object.
 * @param {Array} involvedProducts - Array of products involved in the promotion,
 * each including `nome`, `documentId`, `tipo_applicazione_promozione`, `valore_promozione`.
 * @returns {string} The formatted email body.
 */
export const generatePromotionEmailBody = (promotion, involvedProducts) => {
  if (!promotion) {
    return "Gentile Cliente,\n\nAbbiamo un'offerta speciale per te!";
  }

  const { titolo, descrizione, codice, data_fine } = promotion;

  let emailBody = `Gentile Cliente,

Siamo entusiasti di presentarti la nostra nuova promozione esclusiva:
"${titolo}"

Descrizione: ${descrizione || 'Nessuna descrizione fornita.'}
`;

  if (codice) {
    emailBody += `Codice Promozione: ${codice}\n`;
  }

  if (data_fine) {
    const endDate = new Date(data_fine).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
    emailBody += `Questa offerta è valida fino al ${endDate}.\n`;
  }

  if (involvedProducts && involvedProducts.length > 0) {
    emailBody += `\nProdotti inclusi nella promozione:\n`;
    involvedProducts.forEach(product => {
      emailBody += `- ${product.nome} `;
      if (product.prezzo_unitario) {
        emailBody += `(Prezzo base: €${product.prezzo_unitario.toFixed(2)}) `;
      }
      if (product.tipo_applicazione_promozione && product.valore_promozione !== undefined) {
        let discountText = ` (${product.tipo_applicazione_promozione.charAt(0).toUpperCase() + product.tipo_applicazione_promozione.slice(1)}: ${product.valore_promozione}`;
        if (product.tipo_applicazione_promozione === 'percentuale') { // Example: handle percentage sign
          discountText += '%';
        } else { // Assume fixed amount
          discountText += '€';
        }
        discountText += ')';
        emailBody += discountText;
      }
      // Link to product detail page (assuming documentId is correct for path)
      if (product.documentId && Pages.CATALOG) {
        const productDetailPageUrl = `${APP_URL}/${Pages.CATALOG}/${product.documentId}`;
        emailBody += ` - Scopri di più: ${productDetailPageUrl}\n`;
      } else {
        emailBody += `\n`; // New line if no link
      }
    });
  } else {
    emailBody += `\nQuesta promozione si applica a una selezione di prodotti in negozio.\n`;
  }

  emailBody += `\nNon perdere questa incredibile opportunità!

Ti aspettiamo nel nostro negozio per scoprire tutte le novità e approfittare della promozione.

Cordiali saluti,
Il Team Ottica Moderna
`;

  return emailBody;
};

/**
 * Generates the subject line for a promotional email.
 * @param {object} promotion - The full promotion object.
 * @returns {string} The email subject.
 */
export const generatePromotionEmailSubject = (promotion) => {
  return `Promozione Esclusiva: ${promotion?.titolo || 'Offerta Speciale per Te!'}`;
};