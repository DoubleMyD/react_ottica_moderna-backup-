// src/data/dummyPurchases.js

export const dummyPurchases = [
  {
    id: "ORD001",
    date: "2024-04-15",
    totalQuantity: 3,
    totalPayment: 339.98,
    products: [
      {
        productId: 1, // Matches dummyProducts[0].id
        quantity: 1,
        unitPriceAtPurchase: 150.0,
        actualPrice: 150.0,
      },
      {
        productId: 8, // Matches dummyProducts[7].id
        quantity: 2,
        unitPriceAtPurchase: 75.0,
        actualPrice: 69.99, // Example of discount
      },
    ],
  },
  {
    id: "ORD002",
    date: "2023-11-20",
    totalQuantity: 1,
    totalPayment: 250.0,
    products: [
      {
        productId: 2, // Matches dummyProducts[1].id
        quantity: 1,
        unitPriceAtPurchase: 250.0,
        actualPrice: 250.0,
      },
    ],
  },
  {
    id: "ORD003",
    date: "2023-07-01",
    totalQuantity: 3,
    totalPayment: 320.0,
    products: [
      {
        productId: 4, // Matches dummyProducts[3].id
        quantity: 2,
        unitPriceAtPurchase: 120.0,
        actualPrice: 120.0,
      },
      {
        productId: 7, // Matches dummyProducts[6].id
        quantity: 1, // Corrected quantity to match products array length
        unitPriceAtPurchase: 80.0,
        actualPrice: 80.0,
      },
    ],
  },
];
