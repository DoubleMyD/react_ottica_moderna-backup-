import TopBar from "../components/TopBar/TopBar";
import ReviewCarousel from "../components/ReviewShowcase/ReviewShowcase";
import FAQList from "../components/FAQ/FAQList";
import ContactSection from "../components/ContactSection/ContactSection";
import React from "react";
import ShopShowcaseSection from "../components/HomeShowcase/HomeShowcase";
import useGeneralFAQs from "../hooks/useGeneralFAQs";
import useReviews from "../hooks/useReviews";

const Home = () => {
  const { reviews } = useReviews(true);

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

  const { faqs } = useGeneralFAQs();

  return (
    <div>
      <ShopShowcaseSection />
      <ReviewCarousel reviews={reviews} />
      <FAQList faqs={faqs} />
      <ContactSection />
    </div>
  );
};

export default Home;