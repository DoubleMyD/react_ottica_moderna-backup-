import styled from "styled-components";
import { Colors } from "../../styles/colors";
import { Link } from "react-router-dom";

export const CarouselWrapper = styled.div`
  width: 100%;
  padding: 20px 10px;
  background-color: ${Colors.background};
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
