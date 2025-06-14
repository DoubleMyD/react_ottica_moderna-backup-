// src/hooks/useCampaignManagement.js
import { useState, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api"; // Adjust path
import { buildQueryStringV5 } from "../utils/buildQueryString";
import { useAuth } from "./authContext"; // Adjust path
import { generatePromotionEmailBody, generatePromotionEmailSubject } from "../utils/emailUtils"; // New Email Util

/**
 * Custom hook for managing promotional campaigns, including client fetching,
 * email content generation, and (simulated) email sending.
 *
 * @param {string} promotionId - The Strapi internal ID of the promotion.
 * @param {object} promotionDetails - The full promotion object from usePromotionDetails,
 * including populated tipologia_clientes and dettaglio_promozionis.
 * @param {Array} involvedProducts - The array of products from usePromotionDetails,
 * already formatted with promotion-specific details.
 */
const useCampaignManagement = (promotionId, promotionDetails, involvedProducts) => {
  const { authToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [campaignPrepared, setCampaignPrepared] = useState(null); // Stores prepared data before sending

  /**
   * Prepares the campaign data by fetching all relevant client emails
   * and generating the email content for the promotion.
   */
  const prepareCampaignData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCampaignPrepared(null);

    if (!authToken || !promotionId || !promotionDetails) {
      setError("Dati insufficienti per preparare la campagna.");
      setLoading(false);
      return;
    }

    try {
      const uniqueClientEmails = new Map(); // Map: clientEmail -> clientId to avoid duplicates
      const targetClientsForDb = []; // Array of { clienteId, promozioneId } for tracking sent emails

      if (promotionDetails.tipologia_clientes && promotionDetails.tipologia_clientes.length > 0) {
        // Step 1: Gather all unique clients from associated client types
        const clientTypeIds = promotionDetails.tipologia_clientes.map(tc => tc.id);

        // Fetch clients for these client types. Strapi doesn't allow direct filter on nested relation client types
        // So, we fetch client types with their clients, then filter
        const clientTypesQueryParams = {
          filters: {
            id: {
              $in: clientTypeIds, // Filter for the specific client types linked to this promotion
            },
          },
          populate: {
            clientes: { // Populate the actual clients
              fields: ["id"],
              populate: {
                user: {
                  fields: ["email"],
                }
              },
              filters: {
                iscrizione_newsletter: { // Only target clients subscribed to newsletter
                  $eq: true
                },
              }
            }
          },
          pagination: { pageSize: 100000 },
        };
        const clientTypesQueryString = buildQueryStringV5(clientTypesQueryParams);
        const clientTypesResponse = await fetch(`${STRAPI_BASE_API_URL}/tipologia-clientes?${clientTypesQueryString}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (!clientTypesResponse.ok) {
          const errorData = await clientTypesResponse.json();
          throw new Error(errorData.error?.message || "Errore nel recupero delle tipologie clienti.");
        }

        const clientTypesData = await clientTypesResponse.json();
        const clientsToEmail = [];

        clientTypesData.data.forEach(clientType => {
          if (clientType.clientes && Array.isArray(clientType.clientes)) {
            clientType.clientes.forEach(client => {
              if (client.user.email && !uniqueClientEmails.has(client.user.email)) {
                uniqueClientEmails.set(client.user.email, client.id); // Map email to ID
                clientsToEmail.push({ email: client.user.email, id: client.id }); // Add to send list
              }
            });
          }
        });

        // Step 2: Generate email content
        const emailSubject = generatePromotionEmailSubject(promotionDetails);
        const emailBody = generatePromotionEmailBody(promotionDetails, involvedProducts);

        // Prepare records for cliente_promoziones
        clientsToEmail.forEach(client => {
          targetClientsForDb.push({
            clienteId: client.id,
            promozioneId: promotionDetails.id,
          });
        });

        setCampaignPrepared({
          clientsToEmail,
          emailSubject,
          emailBody,
          targetClientsForDb,
        });

      } else {
        setError("Nessuna tipologia cliente associata a questa promozione.");
      }
    } catch (err) {
      console.error("Errore nella preparazione della campagna:", err);
      setError(err.message);
      setCampaignPrepared(null);
    } finally {
      setLoading(false);
    }
  }, [authToken, promotionId, promotionDetails, involvedProducts]);

  /**
   * Simulates sending emails and records the sending event in Strapi.
   * In a real application, this would involve a backend call to an email service.
   */
  const sendCampaignEmails = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!authToken || !campaignPrepared) {
      setError("Campagna non preparata o autenticazione mancante.");
      setLoading(false);
      return false;
    }

    try {
      console.log("--- Simulating Email Campaign Send ---");
      console.log(`Sending ${campaignPrepared.clientsToEmail.length} emails for promotion: ${promotionDetails.titolo}`);
      console.log("Subject:", campaignPrepared.emailSubject);
      console.log("Example Body (first 200 chars):\n", campaignPrepared.emailBody.substring(0, 200) + "...");

      const successfulSends = [];
      const failedSends = [];

      // Simulate sending emails (in a real app, this would be a single batch API call to a backend service)
      // For each client, record the "sent" event in cliente_promoziones
      for (const client of campaignPrepared.clientsToEmail) {
        try {
          const clientePromozionePayload = {
            data: {
              data_invio: new Date().toISOString(),
              promozione: promotionDetails.id, // Link to promotion by its Strapi ID
              cliente: client.id,             // Link to client by its Strapi ID
            },
          };

          const response = await fetch(`${STRAPI_BASE_API_URL}/storico-promozionis`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(clientePromozionePayload),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to record sent email for client ${client.id}: ${errorData.error?.message || response.statusText}`);
          }
          successfulSends.push(client.email);
          console.log(`Email sent (simulated) and record created for ${client.email}`);

        } catch (recordError) {
          console.error(`Failed to record email sent for ${client.email}:`, recordError.message);
          failedSends.push({ email: client.email, error: recordError.message });
        }
      }

      console.log(`Successfully recorded ${successfulSends.length} sent emails.`);
      if (failedSends.length > 0) {
        console.warn(`Failed to record ${failedSends.length} sent emails:`, failedSends);
        setError(`Alcune email non sono state registrate. Riprova. Errori: ${failedSends.map(f => f.email).join(', ')}`);
        return false;
      }
      console.log("Full email body: ", campaignPrepared.emailSubject, campaignPrepared.emailBody)
      return true; // Indicate success
    } catch (err) {
      console.error("Errore durante l'invio della campagna email:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [authToken, campaignPrepared, promotionDetails]);

  return { loading, error, campaignPrepared, prepareCampaignData, sendCampaignEmails };
};

export default useCampaignManagement;