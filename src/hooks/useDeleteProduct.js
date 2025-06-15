// src/hooks/useDeleteProduct.js
import { useState, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api";
import { useAuth } from "./authContext"; // Assuming this path is correct and provides role and authToken
import { Role } from "../data/constants";

/**
 * Custom hook for deleting a product and its associated image from Strapi.
 * Ensures that the delete operation is only performed by an 'Admin' user
 * by conditionally including the Authorization token.
 *
 * @returns {object} An object containing:
 * - deleteProduct: A function to initiate the deletion process.
 * - loading: A boolean indicating if the deletion is in progress.
 * - error: An error message if the deletion fails.
 */
const useDeleteProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { role, authToken } = useAuth(); // Get role and authToken from auth context

  const deleteProduct = useCallback(
    async (productId, productDocumentId, imageId) => {
      // Accept productDocumentId and imageId
      setLoading(true);
      setError(null);

      // Construct headers conditionally based on user role
      const requestHeaders = {};
      if (role !== Role.ADMIN && authToken) {
        setError(
          "Non hai i permessi di amministratore per eliminare prodotti."
        );
        setLoading(false);
        return false; // Not authorized
      }

      try {
        // Step 1: Delete associated image if it exists
        if (imageId) {
          console.log(`Attempting to delete image with ID: ${imageId}`);
          const imageDeleteResponse = await fetch(
            `${STRAPI_BASE_API_URL}/upload/files/${imageId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${authToken}`,
              }, // Use the same conditional headers
            }
          );

          if (!imageDeleteResponse.ok) {
            const errorData = await imageDeleteResponse.json();
            console.error("Error deleting product image:", errorData);
            // Don't throw error here, as product deletion might still proceed
            // Just warn and continue if image deletion fails but product deletion is desired
          } else {
            console.log(`Image with ID ${imageId} deleted successfully.`);
          }
        }

        // Step 2: Delete the main product entry using its documentId for Strapi v5
        const productDeleteResponse = await fetch(
          `${STRAPI_BASE_API_URL}/prodottos/${productDocumentId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${authToken}` }, // Use the same conditional headers
          }
        );

        if (!productDeleteResponse.ok) {
          const errorData = await productDeleteResponse.json();
          throw new Error(
            errorData.error?.message ||
              `Errore durante l'eliminazione del prodotto: ${productDeleteResponse.statusText}`
          );
        }

        console.log(
          `Product with Document ID ${productDocumentId} deleted successfully.`
        );
        return true; // Success
      } catch (err) {
        console.error("Failed to delete product:", err);
        setError(err.message);
        return false; // Failure
      } finally {
        setLoading(false);
      }
    },
    [authToken, role] // Dependencies for useCallback
  );

  return { deleteProduct, loading, error };
};

export default useDeleteProduct;
