// src/components/ProductDetailPage/ProductDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dummyProducts } from "../data/test/dummyProducts"; // Import dummy product data
import {
  ProductDetailContainer,
  BackArrowButton, // <--- Import the new button
  ProductDetailHeader,
  ProductName,
  ProductIdText,
  ProductContentWrapper,
  ProductImageContainer,
  ProductImage,
  ProductInfoContainer,
  ProductDescription,
  ProductPrice,
  BackButton,
  NotFoundMessage,
} from "../styles/StyledProductDetails";
import { Pages } from "../data/constants";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const idAsNumber = parseInt(productId, 10);

    // Simulate API call delay for demonstration
    setTimeout(() => {
      const foundProduct = dummyProducts.find((p) => p.id === idAsNumber);
      setProduct(foundProduct);
      setLoading(false);
    }, 300); // Simulate network latency
  }, [productId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const handleGoBack = () => {
    navigate(-1); // <--- This navigates to the previous page in history
  };

  if (loading) {
    return (
      <ProductDetailContainer>
        {/* Back arrow still visible during loading */}
        <BackArrowButton onClick={handleGoBack}>
          &larr; {/* Left arrow character */}
        </BackArrowButton>
        <p>Caricamento prodotto...</p>
      </ProductDetailContainer>
    );
  }

  if (!product) {
    return (
      <ProductDetailContainer>
        <NotFoundMessage>Prodotto non trovato.</NotFoundMessage>
        {/* You can keep a BackButton here if you want a clear text button for 'not found' state */}
        <BackButton onClick={handleGoBack}>Torna Indietro</BackButton>
      </ProductDetailContainer>
    );
  }

  return (
    <ProductDetailContainer>
      <BackArrowButton onClick={handleGoBack}>
        &larr; {/* Left arrow character */}
      </BackArrowButton>

      <ProductDetailHeader>
        <ProductName>{product.name}</ProductName>
        <ProductIdText>ID Prodotto: {product.id}</ProductIdText>
      </ProductDetailHeader>

      <ProductContentWrapper>
        <ProductImageContainer>
          <ProductImage src={product.imageUrl} alt={product.name} />
        </ProductImageContainer>

        <ProductInfoContainer>
          <ProductPrice>{formatCurrency(product.price)}</ProductPrice>
          <ProductDescription>{product.description}</ProductDescription>
          <p>
            <strong>Brand:</strong> {product.brand}
          </p>
          <p>
            <strong>Tipo:</strong> {product.type}
          </p>
          <p>
            <strong>Disponibilità:</strong>{" "}
            {product.disponibile ? "Disponibile" : "Non Disponibile"}
          </p>
        </ProductInfoContainer>
      </ProductContentWrapper>
    </ProductDetailContainer>
  );
};

export default ProductDetailPage;
