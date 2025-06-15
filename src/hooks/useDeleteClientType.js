// src/hooks/useDeleteClientType.js
import { useState, useCallback } from "react";
import { STRAPI_BASE_API_URL } from "../data/api"; // Assuming STRAPI_BASE_API_URL is defined here
import { useAuth } from "./authContext"; // Assuming authContext is at root of hooks

const useDeleteClientType = () => {
  const { authToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Deletes a client type by its Strapi internal ID.
   * Assumes Strapi handles unlinking of many-to-many relationships automatically on deletion.
   * @param {string} clientTypeId - The Strapi internal ID of the client type to delete.
   * @returns {boolean} True if deletion was successful, false otherwise.
   */
  const deleteClientType = useCallback(
    async (clientTypeDocumentId) => {
      setLoading(true);
      setError(null);

      if (!authToken || !clientTypeDocumentId) {
        setError(
          "Autenticazione o ID tipologia cliente mancante per l'eliminazione."
        );
        setLoading(false);
        return false;
      }

      try {
        console.log(
          `Attempting to delete client type with ID: ${clientTypeDocumentId}`
        );
        const response = await fetch(
          `${STRAPI_BASE_API_URL}/tipologia-clientes/${clientTypeDocumentId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.message ||
              `Failed to delete client type: ${response.statusText}`
          );
        }

        console.log(`Client type ${clientTypeDocumentId} deleted successfully.`);
        setLoading(false);
        return true; // Indicate success
      } catch (err) {
        console.error("Error during client type deletion:", err);
        setError(err.message);
        setLoading(false);
        return false; // Indicate failure
      }
    },
    [authToken]
  );

  return { deleteClientType, loading, error };
};

export default useDeleteClientType;
