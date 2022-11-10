export default function removeContainer() {
  const productsContainer = document.querySelector('.products-container');
  const categoriesContainer = document.querySelector('.categories-container');
  const ordersContainer = document.querySelector('.orders-container');
  const addCategoryModal = document.querySelector('.add-category-modal');
  const addProductModal = document.querySelector('.add-product-modal');
  const addOrderModal = document.querySelector('.add-order-modal');
  
  if (productsContainer) { productsContainer.remove() };
  if (ordersContainer) { ordersContainer.remove(); };
  if (categoriesContainer) { categoriesContainer.remove(); };
  if (addProductModal) { addProductModal.remove() };
  if (addCategoryModal) { addCategoryModal.remove() };
  if (addOrderModal) { addOrderModal.remove(); };
};