// src/hooks/stats/useMostSoldProduct.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../authContext";
import { buildQueryStringV5 } from "../../../utils/buildQueryString";
import { STRAPI_BASE_API_URL } from "../../../data/api";

const useMostSoldProduct = () => {
  const { authToken } = useAuth();
  const [mostSoldProduct, setMostSoldProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMostSold = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMostSoldProduct(null);

    if (!authToken) {
      setError("Autenticazione necessaria per il prodotto più venduto.");
      setLoading(false);
      return;
    }

    try {
      // Fetch all dettaglio_acquistos with product info
      const queryParams = {
        populate: {
          prodotto: {
            fields: ["nome", "documentId", "tipologia", "brand"], // Get product name and other identifiers
          },
        },
        fields: ["quantita"], // Quantity sold for each detail item
        pagination: { pageSize: 100000 }, // Fetch all records
      };
      const queryString = buildQueryStringV5(queryParams);

      const response = await fetch(
        `${STRAPI_BASE_API_URL}/dettaglio-acquistos?${queryString}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message ||
            `Failed to fetch most sold product data: ${response.statusText}`
        );
      }

      const data = await response.json();
      const productSales = new Map(); // Map: productId -> { productData, totalQuantitySold }

      data.data.forEach((item) => {
        const product = item.prodotto;
        if (product && product.id) {
          const currentQuantity = productSales.get(product.id) || {
            product: product,
            totalQuantity: 0,
          };
          currentQuantity.totalQuantity += item.quantita || 0;
          productSales.set(product.id, currentQuantity);
        }
      });

      let topProduct = null;
      let maxQuantity = 0;

      productSales.forEach((value) => {
        if (value.totalQuantity > maxQuantity) {
          maxQuantity = value.totalQuantity;
          topProduct = value.product;
        }
      });

      if (topProduct) {
        setMostSoldProduct({ ...topProduct, totalQuantitySold: maxQuantity });
      } else {
        setMostSoldProduct(null); // No sales data
      }
    } catch (err) {
      console.error("Error fetching most sold product:", err);
      setError(err.message);
      setMostSoldProduct(null);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchMostSold();
  }, [fetchMostSold]);

  return { mostSoldProduct, loading, error, refetch: fetchMostSold };
};

export default useMostSoldProduct;
