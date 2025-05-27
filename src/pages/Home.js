import TopBar from "../components/TopBar/TopBar";
import ReviewCarousel from "../components/ReviewShowcase/ReviewShowcase";
import FAQList from "../components/FAQ/FAQList";
import ContactSection from "../components/ContactSection/ContactSection";
import React from "react";

const Home = () => {
  const dummyReviews = [
    {
      rating: 5,
      title: "Exceptional Quality!",
      userName: "Sophia M.",
      date: "2024-05-20",
      description:
        "The product is outstanding, and the customer service was even better. Highly recommend for anyone looking for reliability and excellence.",
    },
    {
      rating: 4,
      title: "Very Satisfied!",
      userName: "Liam K.",
      date: "2024-05-18",
      description:
        "Good value for money. It does exactly what it promises, and the setup was a breeze. Minor improvements could make it perfect.",
    },
    {
      rating: 5,
      title: "Life-Changing Purchase",
      userName: "Olivia R.",
      date: "2024-05-15",
      description:
        "I can't imagine my daily routine without this now. It's intuitive, efficient, and truly makes a difference. A must-have!",
    },
    {
      rating: 3,
      title: "Average Experience",
      userName: "Noah P.",
      date: "2024-05-12",
      description:
        "It's an okay product, but I've seen better. Some features are a bit clunky, and the performance isn't always consistent.",
    },
  ];

  const dummyFAQs = [
    {
      id: "faq1",
      question: "Quali sono gli orari di apertura del negozio?",
      answer:
        "Il nostro negozio è aperto dal Lunedì al Venerdì, dalle 9:00 alle 18:00. Il Sabato e la Domenica siamo chiusi.",
    },
    {
      id: "faq2",
      question: "Accettate pagamenti con carta di credito?",
      answer:
        "Sì, accettiamo tutte le principali carte di credito (Visa, MasterCard, American Express) e pagamenti tramite PayPal.",
    },
    {
      id: "faq3",
      question: "Posso effettuare un reso o un cambio?",
      answer:
        "Certo! Offriamo resi e cambi entro 30 giorni dall'acquisto, a condizione che l'articolo sia in perfette condizioni e con lo scontrino originale. Consulta la nostra politica di resi per maggiori dettagli.",
    },
    {
      id: "faq4",
      question: "Offrite spedizioni internazionali?",
      answer:
        "Attualmente, spediamo solo all'interno del territorio nazionale. Stiamo lavorando per estendere le nostre spedizioni anche a livello internazionale in futuro.",
    },
    {
      id: "faq5",
      question: "Come posso contattare il servizio clienti?",
      answer:
        "Puoi contattarci tramite la sezione 'Contatti' del nostro sito web, inviandoci una email a assistenza@tuosito.com, o chiamandoci al numero 0123-456789 durante gli orari di apertura.",
    },
  ];

  return (
    <div>
      <TopBar />
      <ReviewCarousel reviews={dummyReviews} />
      <FAQList faqs={dummyFAQs} />
      <ContactSection />
    </div>
  );
};

export default Home;