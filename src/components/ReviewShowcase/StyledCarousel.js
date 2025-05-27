import styled from "styled-components";
import { Link } from "react-router-dom";

export const CarouselWrapper = styled.div`
  width: 100%;
  padding: 20px 0;
  box-sizing: border-box;

  /* You might add global Swiper styling here if needed, targeting Swiper's default classes */
  .swiper-button-prev,
  .swiper-button-next {
    color: #000; /* Example: make Swiper's default arrows black */
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    &::after {
      font-size: 1.2rem;
    }
  }

  .swiper-button-prev {
    left: 10px;
  }
  .swiper-button-next {
    right: 10px;
  }
`;


// You don't need CarouselContainer or CarouselArrow as Swiper handles these
// export const CarouselContainer = styled.div``;
// export const CarouselArrow = styled.button``;

export const ButtonContainer = styled.div`
  margin-top: 50px; /* Space above the button */
  margin-bottom: 50px; /* Space below the button */
  text-align: center; /* Ensures the inline-block button is centered */
`;

export const CtaButton = styled(Link)`
  display: inline-block; /* Allows text-align to center it if parent is block */
  background-color: #007bff; /* A nice blue, adjust as needed */
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none; /* Remove underline from Link */
  font-size: 1.1rem;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #0056b3; /* Darker blue on hover */
    transform: translateY(-2px); /* Slight lift effect */
  }

  &:active {
    transform: translateY(0);
  }
`;
