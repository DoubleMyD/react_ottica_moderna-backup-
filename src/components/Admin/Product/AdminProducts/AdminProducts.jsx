// src/components/Admin/Product/AdminProductsSection.jsx
import React, { useState, useEffect } from "react";
import ProductFormModal from "../../../Modals/ProductFormModal"; // Changed import to ProductFormModal
import {
  AdminHeader,
  AdminSectionTitle,
  AdminActionButton,
} from "../../../../styles/StyledAdminDashboard";
import {StatsGridContainer} from "../../../Stats/StyledStatCards"
import useProducts from "../../../../hooks/useProducts"; // Your modified useProducts hook
import CatalogoPage from "../../../../pages/Catalogo";
import MostSoldProductCard from "../../../Stats/ProducPromotionStats/MostSoldProductCard";
import MostProfitableProductTypeCard from "../../../Stats/ProducPromotionStats/MostProfitableProductTypeCard";
import TopContributingBrandCard from "../../../Stats/ProducPromotionStats/TopContributingBrandCard";

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
    setIsModalOpen(false);
    setEditingProduct(null);
    refetchProducts(); // Refresh the product list after successful creation/update
  };

  const handleEditProduct = (productData) => {
    // Now accepts full product data
    setEditingProduct(productData); // Set the product data to be edited
    setIsModalOpen(true); // Open the modal
  };

  // The handleDeleteProduct function will now simply call the refetch after deletion
  // The actual deletion logic and modal are handled by DeleteProductButton
  const handleDeleteProductSuccess = () => {
    refetchProducts(); // Refetch the list after a successful deletion
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
        onDeleteProduct={handleDeleteProductSuccess}
      />

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleFormSuccess} // Unified success callback
        initialData={editingProduct} // Pass the product data for editing
        onFaqSuccess={refetchProducts}
        key={editingProduct ? editingProduct.id : "new-product"} // Key to force re-render/re-initialization of modal form
      />
    </div>
  );
};

export default AdminProductsSection;
