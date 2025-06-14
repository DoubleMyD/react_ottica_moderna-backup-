// src/components/Stats/ClientsByTypeDistributionCard.jsx
import React from 'react';
import { StatCardContainer, StatTitle, PlaceholderText } from '../StyledStatCards';
import useClientsByTypeDistribution from "../../../hooks/stats/ClientsStatsHooks/useClientsByTypeDistribution";
// Optional: If you want to integrate Chart.js here, you'd import it and its helpers.
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Doughnut } from 'react-chartjs-2';

// ChartJS.register(ArcElement, Tooltip, Legend); // Register for Doughnut chart

const ClientsByTypeDistributionCard = () => {
  const { distribution, loading, error } = useClientsByTypeDistribution();

  if (loading) {
    return <StatCardContainer><PlaceholderText>Caricamento Distribuzione...</PlaceholderText></StatCardContainer>;
  }
  if (error) {
    return <StatCardContainer><PlaceholderText style={{color: 'red'}}>Errore: {error}</PlaceholderText></StatCardContainer>;
  }

  // Prepare data for a potential chart or just display as list
  const chartData = {
    labels: distribution.map(d => d.name),
    datasets: [{
      data: distribution.map(d => d.count),
      backgroundColor: [
        '#007BFF', '#28A745', '#DC3545', '#FFC107', '#17A2B8', // Example colors
        '#6C757D', '#6F42C1', '#FD7E14', '#20C997', '#E83E8C'
      ],
      hoverOffset: 4
    }]
  };

  return (
    <StatCardContainer style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <StatTitle>Distribuzione Clienti per Tipologia</StatTitle>
      {distribution.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0', width: '100%' }}>
          {distribution.map((type, index) => (
            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dotted #eee', fontSize: '0.95rem' }}>
              <span style={{ color: type.count > 0 ? '#333' : '#999' }}>{type.name}</span>
              <span style={{ fontWeight: 'bold', color: '#007BFF' }}>{type.count}</span>
            </li>
          ))}
        </ul>
        /*
        // UNCOMMENT BELOW FOR CHART.JS DOUGHNUT CHART (requires npm install react-chartjs-2 chart.js)
        <div style={{ width: '80%', height: 'auto', margin: '20px auto' }}>
          <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
        */
      ) : (
        <PlaceholderText>Nessuna tipologia cliente con associati.</PlaceholderText>
      )}
    </StatCardContainer>
  );
};

export default ClientsByTypeDistributionCard;