// src/hooks/useUserAndClienteData.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./authContext";
import { STRAPI_BASE_URL } from "./api";

const useUserAndClienteData = () => {
  const { authToken } = useAuth();
  const [userData, setUserData] = useState(null); // Raw Strapi User data
  const [clienteData, setClienteData] = useState(null); // Raw Strapi Cliente data (with id and attributes)
  const [clienteId, setClienteId] = useState(null); // ID of the Cliente entry
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserAndCliente = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!authToken) {
      setError("Autenticazione necessaria per visualizzare il profilo.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    try {
      // 1. Fetch authenticated user's basic data
      const userRes = await fetch(`${STRAPI_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        signal: controller.signal,
      });

      if (!userRes.ok) {
        throw new Error(
          `HTTP error fetching user data! status: ${userRes.status}`
        );
      }
      const fetchedUserData = await userRes.json();
      setUserData(fetchedUserData);

      // 2. Fetch Cliente profile linked to this user ID
      const clienteRes = await fetch(
        `${STRAPI_BASE_URL}/clientes?filters[user][id][$eq]=${fetchedUserData.id}&populate=user`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          signal: controller.signal,
        }
      );

      if (!clienteRes.ok) {
        throw new Error(
          `HTTP error fetching client profile! status: ${clienteRes.status}`
        );
      }

      const clienteResponse = await clienteRes.json();
      const fetchedClienteEntry = clienteResponse.data[0]; // Assuming only one Cliente entry per user

      if (fetchedClienteEntry) {
        setClienteId(fetchedClienteEntry.id);
        setClienteData(fetchedClienteEntry);
      } else {
        setClienteId(null);
        setClienteData(null); // Explicitly null if not found
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
  }, [authToken]);

  useEffect(() => {
    fetchUserAndCliente();
  }, [fetchUserAndCliente]); // Dependency array ensures it runs when fetchUserAndCliente changes

  const updateClienteProfile = useCallback(
    async (updates) => {
      setLoading(true);
      setError(null);

      if (!authToken || !userData?.id) {
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
        let dataToSend = updates; // The updates object is already prepared by the calling component

        if (clienteId) {
          // Existing Cliente profile
          method = "PUT";
          url = `${STRAPI_BASE_URL}/clientes/${clienteId}`;
        } else {
          // New Cliente profile
          method = "POST";
          url = `${STRAPI_BASE_URL}/clientes`;
          dataToSend = { ...updates, user: userData.id }; // Link to user on creation
        }

        response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ data: dataToSend }), // Strapi v4 requires { data: ... }
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to update/create client profile:", errorData);
          throw new Error(
            errorData.error?.message || `HTTP error! status: ${response.status}`
          );
        }

        const responseData = await response.json();
        const updatedClienteEntry = responseData.data;

        // Update the internal state with the new data
        setClienteId(updatedClienteEntry.id);
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
    [authToken, userData, clienteId]
  ); // Dependencies for useCallback

  return {
    userData,
    clienteData,
    loading,
    error,
    updateClienteProfile,
    refetch: fetchUserAndCliente, // Provide a way to manually refetch
  };
};

export default useUserAndClienteData;
