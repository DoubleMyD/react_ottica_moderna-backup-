// src/components/ClientDetail/ClientHeaderSection.jsx
import React from "react";
import {
  ClientHeader,
  ClientInfoBlock,
  FilterTagContainer,
  FilterTag,
} from "./StyledClientHeaderSection"; // Import from new style file
import { formatCurrency, formatItalianDate } from "../../../utils/formatters"; // Assuming formatItalianDate is also available

const ClientHeaderSection = ({
  clientAttributes,
  clientTypes,
  allTimeSpent,
  onTipologyClick,
}) => {
  if (!clientAttributes) {
    return null; // Or a loading/placeholder if data is missing
  }

  const {
    nome,
    cognome,
    user,
    data_nascita,
    nazionalita,
    citta,
    cap,
    indirizzo,
    // Assuming documentId is also passed in clientAttributes now
  } = clientAttributes;

  const email = user?.email;
  
  return (
    <ClientHeader>
      <ClientInfoBlock>
        <h3>Nome</h3>
        <p>{nome}</p>
      </ClientInfoBlock>
      <ClientInfoBlock>
        <h3>Cognome</h3>
        <p>{cognome}</p>
      </ClientInfoBlock>
      <ClientInfoBlock>
        <h3>Data di Nascita</h3>
        <p>{data_nascita ? formatItalianDate(data_nascita) : "N.D."}</p>
      </ClientInfoBlock>
      <ClientInfoBlock>
        <h3>Nazionalità</h3>
        <p>{nazionalita}</p>
      </ClientInfoBlock>
      <ClientInfoBlock>
        <h3>Città</h3>
        <p>{citta}</p>
      </ClientInfoBlock>
      <ClientInfoBlock>
        <h3>CAP</h3>
        <p>{cap}</p>
      </ClientInfoBlock>
      <ClientInfoBlock className="full-width">
        <h3>Email</h3>
        <p>{email}</p>
      </ClientInfoBlock>
      <ClientInfoBlock className="full-width">
        <h3>Indirizzo</h3>
        <p>{indirizzo}</p>
      </ClientInfoBlock>
      <ClientInfoBlock className="full-width total-spent">
        {" "}
        {/* Added class for distinct styling */}
        <h3>Totale Speso in Negozio</h3>
        <p>{formatCurrency(allTimeSpent)}</p>
      </ClientInfoBlock>
      <ClientInfoBlock className="full-width client-types">
        {" "}
        <h3>Tipologie Cliente</h3>
        {/* Added class for distinct styling */}
        {clientTypes && clientTypes.length > 0 ? (
          <>
            <FilterTagContainer>
              {clientTypes.map((type) => (
                <FilterTag
                  key={type.id}
                  onClick={(e) => onTipologyClick(type.id, e)} // Simplify onClick
                >
                  {type.nome}
                </FilterTag>
              ))}
            </FilterTagContainer>
          </>
        ) : ( 
        <p>Nessuna tipologia associata</p>
        )}
      </ClientInfoBlock>
    </ClientHeader>
  );
};

export default ClientHeaderSection;
