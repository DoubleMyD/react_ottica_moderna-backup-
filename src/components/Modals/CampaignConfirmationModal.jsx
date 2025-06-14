// src/components/Modals/CampaignConfirmationModal.jsx
import React, { useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal'; // Reusable modal
import useCampaignManagement from '../../hooks/useCampaignManagement'; // Your campaign hook
import { MessageHighlight } from '../../styles/Modals/StyledConfirmationModal'; // From shared styled file

const CampaignConfirmationModal = ({ isOpen, onClose, promotion, involvedProducts, onCampaignSentSuccess }) => {
  const {
    loading,
    error,
    campaignPrepared,
    prepareCampaignData,
    sendCampaignEmails,
  } = useCampaignManagement(promotion?.id, promotion, involvedProducts);

  // Trigger campaign data preparation when modal opens or promotion/products change
  useEffect(() => {
    if (isOpen) {
      prepareCampaignData();
    }
  }, [isOpen, promotion, involvedProducts, prepareCampaignData]);

  const handleConfirmSend = async () => {
    const success = await sendCampaignEmails();
    if (success) {
      onCampaignSentSuccess(); // Notify parent of success
    }
  };

  const title = "Conferma Avvio Campagna";
  let messageContent;
  let confirmButtonText = "Avvia Campagna";
  let showConfirmButton = false;

  if (loading) {
    messageContent = <p>Preparazione campagna in corso...</p>;
    showConfirmButton = false; // Disable confirm button during preparation
  } else if (error) {
    messageContent = <p style={{ color: 'red' }}>Errore: {error}</p>;
    showConfirmButton = false;
  } else if (campaignPrepared) {
    messageContent = (
      <div>
        <p>Stai per avviare la campagna promozionale "<MessageHighlight>{promotion?.titolo}</MessageHighlight>".</p>
        <p>Verranno inviate email a <MessageHighlight>{campaignPrepared.clientsToEmail.length}</MessageHighlight> clienti unici.</p>
        <p style={{fontSize: '0.9em', color: '#666', fontStyle: 'italic', marginTop: '10px'}}>
          Assicurati che i dettagli della promozione e dei prodotti siano corretti.
        </p>
        {/* Optional: Add a small preview of the email */}
        <div style={{ maxHeight: '100px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9', marginTop: '15px', textAlign: 'left' }}>
          <h4 style={{margin: '0 0 5px 0', fontSize: '1em', color: '#555'}}>Anteprima Email:</h4>
          <p style={{whiteSpace: 'pre-wrap', fontSize: '0.8em', margin: 0}}>{campaignPrepared.emailBody.substring(0, 300)}...</p>
        </div>
      </div>
    );
    showConfirmButton = campaignPrepared.clientsToEmail.length > 0;
  } else {
    messageContent = <p>Campagna non pronta o nessun cliente idoneo trovato.</p>;
    showConfirmButton = false;
  }

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirmSend}
      title={title}
      loading={loading}
      error={error}
      confirmText={confirmButtonText}
      cancelText="Annulla"
    >
      {messageContent}
      {/* Conditionally render actions based on 'showConfirmButton' and 'loading' */}
      {/* ConfirmationModal already handles loading for buttons, just need to manage its internal content */}
    </ConfirmationModal>
  );
};

export default CampaignConfirmationModal;