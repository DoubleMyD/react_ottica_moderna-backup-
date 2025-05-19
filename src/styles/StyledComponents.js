import styled from 'styled-components';
import { Link } from 'react-router-dom';

const BenefitsSection = styled.section`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  padding: 5% 0;
  background-color: #fff;
  text-align: center;
`;

const BenefitItem = styled.div`
  flex: 1;
  margin: 0 2%;
  max-width: 20%;

  h3 {
    font-size: 1.8rem;
    margin: 2% 0;
    font-weight: bold;
  }

  p {
    font-size: 1.4rem;
    color: #666;
  }
`;


const Icon = styled.div`
  font-size: 1.8rem;
  cursor: pointer;
`;

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownToggle = styled.button`
  background: none;
  border: none;
  padding: 1% 3%;
  border-radius: 50px;
  cursor: pointer;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  color: black;

  &:hover {
    background-color: rgb(221, 205, 147);
    color: white;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 0.5% solid #ccc;
  min-width: 15%;
  box-shadow: 0px 0.5% 1% rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const DropdownItem = styled.div`
  padding: 2%;
  &:hover {
    background-color: #f2f2f2;
  }

  a {
    text-decoration: none;
    color: black;
    font-weight: normal;
  }
`;


const StyledButton = styled(Link)`
  background: none;
  border: none;
  padding: 0.5% 1%;
  text-decoration: none;
  color: black;
  font-weight: bold;
  display: flex;
  align-items: center;

  &:hover {
    color: orange; /* Add hover effect */
  }
`;

const Banner = styled.div`
  background-color: #c3c3c3;
  text-align: center;
  padding: 1%;
  font-size: 1.6rem;
`;

const Header = styled.header`
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1% 5%; /* Adjust padding for a cleaner look */
  border-bottom: 1px solid #ddd; /* Optional: Add a subtle border */
`;

const Title = styled.h1`
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  flex: 1;
  text-align: left;
  margin: 0;
`;

const Button = styled.button`
  background: none;
  border: 0;
  padding: 0.5% 2%;
  border-radius: 50px;
  cursor: pointer;
  font-family: 'Arial', sans-serif;
  font-weight: bold;

  &:hover {
    background-color: rgb(73, 68, 73);
    color: white;
  }
`;

const CircularImageContainer = styled.div`
  width: 200px; /* Altezza e larghezza uguali */
  height: 200px;
  border-radius: 50%; /* Forma circolare */
  overflow: hidden;
  display: flex; /* Per centrare l'immagine */
  justify-content: center;
  align-items: center;
  background-color: #fff; /* Sfondo bianco */
  margin: 0 auto 0 -170px; /* Sposta il contenitore verso sinistra */

  img {
    width: 100%; /* Adatta l'immagine al contenitore */
    height: 100%;
    object-fit: cover; /* Copertura uniforme */
    border-radius: 50%; /* Applica la forma circolare anche all'immagine */
  }
`;

const StepContent2 = styled.div`
  flex: 2;
  text-align: left;
  margin-left: 80px; /* Aggiunge uno spazio tra l'immagine e il testo */

  h3 {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1%;
  }

  p {
    font-size: 1.4rem;
    color: #666;
  }
`;


const ProductSection = styled.div`
  display: flex;
  justify-content: start;
  overflow-x: scroll;
  padding: 2% 0;
`;

const ProductCard = styled.div`
  min-width: 15%;
  height: 15%;
  margin-right: 1%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
`;

const BrandStory = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5% 0;
`;

const StoryButton = styled(Button)`
  background-color: black;
  color: white;
`;

const FAQSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5% 0;
`;

const NewsletterSignup = styled.div`
  flex: 1;
  padding-right: 2%;
`;

const ContactInfo = styled.div`
  flex: 1;
  padding-left: 2%;
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  padding: 4% 2%;
  gap: 5%;
  background-color: #f9f9f9;
`;

const HeroImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 80%;
    height: auto;
    max-width: 600%;
    border-radius: 2%;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5%;
`;

const CountdownContainer = styled.div`
  display: flex;
  gap: 2%;
  font-size: 2.4rem;
  font-weight: bold;

  div {
    background: #ff7f50;
    color: white;
    padding: 1% 2%;
    border-radius: 5%;
  }
`;

const DiscountTag = styled.p`
  color: red;
  font-weight: bold;
  font-size: 1.6rem;
`;

const MainHeadline = styled.h2`
  font-size: 2.8rem; /* Riduci ulteriormente la dimensione del font */
  font-weight: bold;
  max-width: 100%; /* Permetti al testo di occupare tutta la larghezza disponibile */
  line-height: 1.2;
  text-align: left; /* Allinea il testo a sinistra */
  margin: 0; /* Rimuovi eventuali margini se necessario */
`;

const CTAButton = styled.button`
  background-color: #ff7f50;
  border: none;
  color: white;
  font-size: 1.8rem;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 60px; 
  
  /* Aumenta il margine superiore */

  &:hover {
    background-color: #ff4f20;
  }
`;

const CTAButton2 = styled.button`
  background-color: #ff7f50;
  border: none;
  color: white;
  font-size: 1.8rem;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin: 50px auto 0 auto; /* Aggiunge spazio sopra e centra orizzontalmente */
  display: block; /* Necessario per il centraggio con margin auto */

  &:hover {
    background-color: #ff4f20;
  }
`;


const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2%;
  margin-top: 40px; /* Aumenta il margine superiore per spostarlo più in basso */

  span {
    font-size: 1.4rem;
    color: #555;
  }
`;

const Star = styled.span`
  color: gold;
  font-size: 1.6rem;
`;

const AssemblySection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4% 2%;
  text-align: center;
  background-color: #f9f9f9;
`;

const AssemblyStep = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2%;
  max-width: 80%;
  gap: 2%;
`;

const StepContent = styled.div`
  flex: 2;
  text-align: left;

  h3 {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1%;
  }

  p {
    font-size: 1.4rem;
    color: #666;
  }
`;

const CircularImage = styled.div`
  flex: 1;
  width: 150px; /* Altezza e larghezza devono essere uguali */
  height: 300px;
  border-radius: 50%; /* Forma circolare */
  overflow: hidden; /* Nascondi tutto ciò che esce dai bordi */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff; /* Opzionale: aggiunge uno sfondo */

  img {
    width: 100%; /* Riempie il contenitore */
    height: 100%;
    object-fit: cover; /* Assicura che l'immagine sia tagliata correttamente */
  }
`;

const CircularImage2 = styled.div`
  width: 200px; /* Larghezza e altezza uguali per un cerchio */
  height: 200px;
  border-radius: 50%; /* Forma circolare */
  overflow: hidden; /* Nasconde ciò che esce dal contenitore */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff; /* Sfondo bianco per bordi visibili */
  margin-top: -50px; /* Sposta l'immagine verso l'alto */
  margin-left: -50px; /* Sposta l'immagine a sinistra */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Garantisce che l'immagine riempia perfettamente il contenitore */
    border-radius: 50%; /* Applica la forma circolare anche all'immagine */
  }
`;

const BrandStoryContainer = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 4% 5%;
  border-radius: 10px; /* Per bordi arrotondati */
  margin: 5% 0;
`;

const BrandStoryText = styled.div`
  flex: 1;
  margin-right: 3%;
  text-align: left;

  h2 {
    font-size: 2.4rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.6rem;
    color: #666;
    line-height: 1.5;
  }
`;

const BrandStoryImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    max-width: 500px;
    border-radius: 10px; /* Arrotonda l'immagine */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const FAQContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 40px;
  background-color: #f9f9f9;
`;

const FAQContent = styled.div`
  flex: 1;
  margin-right: 20px;
`;

const FAQTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const Question = styled.div`
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
  &:hover {
    background-color: #f4f4f4;
  }
`;

const Answer = styled.p`
  margin-top: 5px;
  padding: 15px;
  background: #f7f7f7;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const FAQImage = styled.img`
  flex: 1;
  max-width: 400px;
  border-radius: 10px;
`;

const MoreButton = styled.button`
  background-color: #ff9800;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background-color: #e68900;
  }
`;


const ContactSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 40px;
  background-color: #f2f2f2;
`;

const ContactInfo2 = styled.div`
  flex: 1;
  margin-right: 20px;
`;

const ContactTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const ContactText = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
`;

const StayConnected = styled.div`
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const StayConnectedTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const StayConnectedText = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const EmailForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 5px 10px;
`;

const EmailInput = styled.input`
  flex: 1;
  border: none;
  font-size: 14px;
  padding: 10px;
  outline: none;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  font-size: 16px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const WhatsAppButton = styled.a`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: #25d366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  img {
    width: 35px;
    height: 35px;
  }
`;



export {
  StyledButton,
  Banner,
  Header,
  Title,
  Button,
  CircularImageContainer,
  ProductSection,
  ProductCard,
  BrandStory,
  StoryButton,
  FAQSection,
  NewsletterSignup,
  ContactInfo,
  HeroSection,
  HeroImageContainer,
  HeroContent,
  CountdownContainer,
  DiscountTag,
  MainHeadline,
  CTAButton,
  RatingContainer,
  Star,
  DropdownWrapper,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  BenefitsSection,
  BenefitItem,
  Icon,
  AssemblySection, 
  AssemblyStep, 
  StepContent, 
  CircularImage,
  CircularImage2,
  StepContent2,
  CTAButton2,
  BrandStoryContainer,
  BrandStoryText,
  BrandStoryImageContainer,
  FAQContainer,
  MoreButton,
  FAQImage,
  Answer,
  Question,
  FAQTitle,
  FAQContent,
  ContactSection,
  SubmitButton,
  EmailInput,
  EmailForm,
  StayConnectedText,
  StayConnectedTitle,
  StayConnected,
  ContactText,
  ContactTitle,
  ContactInfo2,
  WhatsAppButton


};
