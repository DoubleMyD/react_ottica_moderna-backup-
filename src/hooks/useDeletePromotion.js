// src/hooks/useDeletePromotion.js
import { useState, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api";
import { buildQueryStringV5 } from "../utils/buildQueryString"; // Needed to fetch related details for deletion
import { useAuth } from "./authContext";

const useDeletePromotion = () => {
  const { authToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Deletes a promotion and its associated dettaglio_promozionis entries.
   * @param {string} promotionId - The Strapi internal ID of the promotion to delete.
   * @param {string} promotionDocumentId - The documentId of the promotion (for fetching details).
   * @returns {boolean} True if deletion was successful, false otherwise.
   */
  const deletePromotion = useCallback(
    async (promotionId, promotionDocumentId) => {
      setLoading(true);
      setError(null);

      if (!authToken || !promotionId || !promotionDocumentId) {
        setError("Autenticazione o ID promozione mancante per l'eliminazione.");
        setLoading(false);
        return false;
      }

      try {
        // Step 1: Fetch associated dettaglio_promozionis for this promotion
        const queryParams = {
          filters: {
            promoziones: {
              id: {
                $eq: promotionId,
              },
            },
          },
          fields: ["id"], // Only need the ID of the detail to delete it
          pagination: { pageSize: 100000 }, // Fetch all
        };
        const queryString = buildQueryStringV5(queryParams);

        const detailsResponse = await fetch(
          `${STRAPI_BASE_API_URL}/dettaglio-promozionis?${queryString}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        if (!detailsResponse.ok) {
          const errorData = await detailsResponse.json();
          throw new Error(
            `Failed to fetch associated dettaglio_promozionis: ${
              errorData.error?.message || detailsResponse.statusText
            }`
          );
        }
        const detailsData = await detailsResponse.json();
        const associatedDettaglioDocumentIds = detailsData.data.map((item) => item.documentId);
        console.log(detailsData);
        // Step 2: Delete associated dettaglio_promozionis
        if (associatedDettaglioDocumentIds.length > 0) {
          console.log(
            `Deleting ${associatedDettaglioDocumentIds.length} associated dettaglio_promozionis...`
          );
          const deleteDetailsPromises = associatedDettaglioDocumentIds.map(
            async (dettaglioDocumentId) => {
              const response = await fetch(
                `${STRAPI_BASE_API_URL}/dettaglio-promozionis/${dettaglioDocumentId}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${authToken}` },
                }
              );
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  `Failed to delete dettaglio_promozione ${dettaglioDocumentId}: ${
                    errorData.error?.message || response.statusText
                  }`
                );
              }
              console.log(`Deleted dettaglio_promozione: ${dettaglioDocumentId}`);
            }
          );
          // Use allSettled to ensure all deletions are attempted, even if some fail
          const detailDeletionResults = await Promise.allSettled(
            deleteDetailsPromises
          );
          const failedDetailDeletions = detailDeletionResults.filter(
            (result) => result.status === "rejected"
          );
          if (failedDetailDeletions.length > 0) {
            console.warn(
              "Some dettaglio_promozione deletions failed:",
              failedDetailDeletions
            );
            // Don't throw here, allow main promotion deletion if details partially failed
          }
        }

        // Step 3: Delete the main Promotion
        console.log(`Deleting main promotion with ID: ${promotionId}`);
        const mainPromoResponse = await fetch(
          `${STRAPI_BASE_API_URL}/promoziones/${promotionDocumentId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        if (!mainPromoResponse.ok) {
          const errorData = await mainPromoResponse.json();
          throw new Error(
            `Failed to delete main promotion ${promotionId}: ${
              errorData.error?.message || mainPromoResponse.statusText
            }`
          );
        }

        console.log("Campagna eliminata con successo!");
        setLoading(false);
        return true; // Indicate success
      } catch (err) {
        console.error("Error during promotion deletion:", err);
        setError(err.message);
        setLoading(false);
        return false; // Indicate failure
      }
    },
    [authToken]
  );

  return { deletePromotion, loading, error };
};

export default useDeletePromotion;
