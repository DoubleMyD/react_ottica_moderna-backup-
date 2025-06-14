// src/components/Admin/Product/AdminProductsSection.jsx
import React, { useState, useEffect } from "react";
import ProductFormModal from "../ProductFormModal/ProductFormModal"; // Changed import to ProductFormModal
import {
  AdminHeader,
  AdminSectionTitle,
  AdminActionButton,
} from "../../styles/StyledAdminDashboard";
import {StatsGridContainer} from "../Stats/StyledStatCards"
import useProducts from "../../hooks/useProduct"; // Your modified useProducts hook
import CatalogoPage from "../../pages/Catalogo";
import MostSoldProductCard from "../Stats/ProducPromotionStats/MostSoldProductCard";
import MostProfitableProductTypeCard from "../Stats/ProducPromotionStats/MostProfitableProductTypeCard";
import TopContributingBrandCard from "../Stats/ProducPromotionStats/TopContributingBrandCard";
import SalesSeasonalityCard from "../Stats/ProducPromotionStats/SalesSeasonalityCard";
import PromotionUsageRateCard from "../Stats/ProducPromotionStats/PromotionUsageRateCard";

const AdminProductsSection = () => {
  // Pass an empty filters object as this component doesn't filter by default
  const { products, loading, error, refetchProducts } = useProducts({});
  const [isModalOpen, setIsModalOpen] = useState(false); // Unified modal state
  const [editingProduct, setEditingProduct] = useState(null); // State to hold product being edited

  const handleCreateNewProduct = () => {
    setEditingProduct(null); // Ensure no product is set for editing
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null); // Clear editing product on close
  };

  const handleFormSuccess = () => {
    console.log("Product form success (create/update) - Triggering refetch");
    setIsModalOpen(false);
    setEditingProduct(null);
    refetchProducts(); // Refresh the product list after successful creation/update
  };

  const handleEditProduct = (productData) => {
    // Now accepts full product data
    console.log(`Modifica prodotto:`, productData);
    setEditingProduct(productData); // Set the product data to be edited
    setIsModalOpen(true); // Open the modal
  };

  const handleDeleteProduct = (documentId) => {
    if (
      window.confirm(
        `Sei sicuro di voler eliminare il prodotto con Document ID ${documentId}?`
      )
    ) {
      // In a real app, you would make an API call to delete the product
      // Example: api.deleteProduct(documentId).then(refetchProducts).catch(err => alert('Errore eliminazione: ' + err.message));
      console.log(`Eliminando prodotto con Document ID: ${documentId}`);
      alert(`Prodotto con ID ${documentId} eliminato (simulato).`);
      refetchProducts(); // Simulate refetch after deletion
    }
  };

  if (loading)
    return (
      <p style={{ padding: "20px", textAlign: "center" }}>
        Caricamento prodotti...
      </p>
    );
  if (error)
    return (
      <p style={{ padding: "20px", textAlign: "center", color: "red" }}>
        Errore: {error}
      </p>
    );

  return (
    <div>
      <StatsGridContainer>
        <MostSoldProductCard />
        <MostProfitableProductTypeCard />
        <TopContributingBrandCard />
        {/* <PromotionUsageRateCard /> */}
      </StatsGridContainer>
      <AdminHeader>
        <AdminSectionTitle>Gestione Prodotti</AdminSectionTitle>
        <AdminActionButton onClick={handleCreateNewProduct}>
          Crea Nuovo Prodotto
        </AdminActionButton>
      </AdminHeader>

      <CatalogoPage
        products={products}
        isAdminView={true}
        onEditProduct={handleEditProduct} // Pass the handleEditProduct function
        onDeleteProduct={handleDeleteProduct}
      />

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleFormSuccess} // Unified success callback
        initialData={editingProduct} // Pass the product data for editing
        key={editingProduct ? editingProduct.id : "new-product"} // Key to force re-render/re-initialization of modal form
      />
    </div>
  );
};

export default AdminProductsSection;
