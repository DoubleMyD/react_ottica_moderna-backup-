// src/hooks/useUserAndClienteData.js
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../hooks/authContext"; // Adjusted path assuming it's in data/
import { STRAPI_BASE_API_URL } from "../data/api"; // Adjusted path assuming it's in data/

const useUserAndClienteData = () => {
  const { authToken, logout } = useAuth(); // Destructure logout if your authContext provides it

  // Use a ref to always hold the latest authToken value to avoid it being a useEffect dependency
  const authTokenRef = useRef(authToken);
  useEffect(() => {
    authTokenRef.current = authToken; // Update the ref whenever authToken changes
  }, [authToken]);

  const [userData, setUserData] = useState(null);
  const [clienteData, setClienteData] = useState(null);
  // clienteDocumentId will be used for PUT/DELETE requests in Strapi 5
  const [clienteDocumentId, setClienteDocumentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserAndCliente = useCallback(async () => {
    setLoading(true);
    setError(null);

    const currentAuthToken = authTokenRef.current;

    if (!currentAuthToken) {
      setError("Autenticazione necessaria per visualizzare il profilo.");
      setLoading(false);
      // It's good practice to log out and redirect if no token is found here.
      // This hook should ideally not handle navigation directly to keep it focused on data.
      // The component using this hook can decide to navigate if error is present.
      // logout(); // Call logout here if appropriate based on your authContext
      return;
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    try {
      // 1. Fetch authenticated user's data and populate the 'cliente' relation
      // Assumes your user model has a relation field named 'cliente' pointing to the Cliente collection.
      const userRes = await fetch(
        `${STRAPI_BASE_API_URL}/users/me?populate=cliente`,
        {
          headers: {
            Authorization: `Bearer ${currentAuthToken}`,
          },
          signal: controller.signal,
        }
      );

      if (!userRes.ok) {
        if (userRes.status === 401 || userRes.status === 403) {
          // If token is invalid/expired, log out
          if (logout) logout(); // Safely call logout if it exists
          throw new Error(
            "Sessione scaduta o non autorizzata. Effettua il login."
          );
        }
        const errorData = await userRes.json();
        throw new Error(
          errorData.error?.message ||
            `Errore fetching user data! Status: ${userRes.status}`
        );
      }

      const fetchedUser = await userRes.json();
      setUserData(fetchedUser);

      // Now, directly access the populated cliente data from the fetched user object
      if (fetchedUser.cliente) {
        // In Strapi 5, use documentId for updates/deletes via direct path
        setClienteDocumentId(fetchedUser.cliente.documentId);
        setClienteData(fetchedUser.cliente); // This is the full populated cliente object
      } else {
        setClienteDocumentId(null);
        setClienteData(null); // No associated cliente profile found
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Il caricamento dei dati del profilo è scaduto. Riprova.");
      } else {
        console.error("Failed to fetch user and client data:", err);
        setError(`Errore nel caricamento dei dati: ${err.message}.`);
      }
    } finally {
      setLoading(false);
      clearTimeout(id);
    }
  }, [logout]); // Added logout to dependencies if it's available

  useEffect(() => {
    fetchUserAndCliente();
  }, [fetchUserAndCliente]);

  const updateClienteProfile = useCallback(
    async (updates) => {
      setLoading(true);
      setError(null);

      const currentAuthToken = authTokenRef.current;

      // Ensure we have a token and user ID before attempting update/create
      if (!currentAuthToken || !userData?.id) {
        setError(
          "Autenticazione o ID utente non disponibile. Impossibile aggiornare."
        );
        setLoading(false);
        return { success: false, error: "Authentication or User ID missing." };
      }

      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000);

      try {
        let response;
        let method;
        let url;
        let dataToSend = updates; // The form data provided

        // --- Crucial Change Here: Use clienteDocumentId for PUT requests ---
        if (clienteDocumentId) {
          // If a cliente profile already exists, update it using documentId
          method = "PUT";
          url = `${STRAPI_BASE_API_URL}/clientes/${clienteDocumentId}`; // Use documentId here!
        } else {
          // If no cliente profile exists, create a new one and link it to the user
          method = "POST";
          url = `${STRAPI_BASE_API_URL}/clientes`;
          // Link the new cliente entry to the current user's ID
          dataToSend = { ...updates, user: userData.id };
        }

        response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentAuthToken}`,
          },
          body: JSON.stringify({ data: dataToSend }), // Strapi v4/v5 requires { data: ... }
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            if (logout) logout(); // Safely call logout if it exists
            throw new Error(
              "Sessione scaduta o non autorizzata. Effettua il login."
            );
          }
          const errorData = await response.json();
          console.error("Failed to update/create client profile:", errorData);
          throw new Error(
            errorData.error?.message || `HTTP error! status: ${response.status}`
          );
        }

        const responseData = await response.json();
        const updatedClienteEntry = responseData.data;

        // After successful update/creation, update the state with the new/updated cliente data
        setClienteDocumentId(updatedClienteEntry.documentId); // Store the documentId
        setClienteData(updatedClienteEntry);

        return { success: true, data: updatedClienteEntry };
      } catch (err) {
        if (err.name === "AbortError") {
          setError("Il salvataggio del profilo è scaduto. Riprova.");
        } else {
          console.error("Error updating client profile:", err);
          setError(`Impossibile salvare il profilo: ${err.message}.`);
        }
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
        clearTimeout(id);
      }
    },
    [userData, clienteDocumentId, logout] // userData, clienteDocumentId, and logout are dependencies
  );

  return {
    userData,
    clienteData,
    loading,
    error,
    updateClienteProfile,
    refetch: fetchUserAndCliente, // Expose refetch for external use
  };
};

export default useUserAndClienteData;
