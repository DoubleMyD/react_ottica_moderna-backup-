// src/utils/formatters.js

export const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "€0.00"; // Default or error value
  }
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

// You can add other formatters here as needed
export const formatItalianDate = (dateString) => {
  if (!dateString) return "N.D.";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Data non valida";
    }
    return date.toLocaleDateString("it-IT");
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Data non valida";
  }
};

export const formatPercentage = (value, locale = "it-IT") => {
  if (value === null || value === undefined) {
    return "N.D.";
  }
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
