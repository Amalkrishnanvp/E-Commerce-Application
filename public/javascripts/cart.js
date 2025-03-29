function changeQuantity(cartId, proId, count) {
  $.ajax({
    url: "/change-product-quantity",
    data: {
      cartId: cartId, // Changed from 'cart'
      productId: proId, // Changed from 'product'
      count: count,
    },
    method: "post",
    success: (response) => {
      // Fixed lowercase 'response'
      console.log(response);
      if (response.updated) {
        // Find the product container by ID
        const productContainer = document.getElementById(proId);

        if (productContainer) {
          // Find the quantity element within this container
          const quantityElement =
            productContainer.querySelector(".quantity-element");

          if (quantityElement) {
            quantityElement.textContent = response.newQuantity;
          }
          btnState(proId);
        }
      }
    },
    error: (err) => {
      console.error("Error:", err);
    },
  });
}

function btnState(productId) {
  // Find the product container by ID
  const productContainer = document.getElementById(productId);

  if (productContainer) {
    // Find the quantity element within this container
    const decBtn = productContainer.querySelector(".decBtn");
    const quantityElement = productContainer.querySelector(".quantity-element");

    if (decBtn && quantityElement) {
      const quantity = parseInt(quantityElement.textContent);

      console.log(quantity);
      // Toggle visibility based on quantity
      if (quantity < 2) {
        decBtn.classList.add("hidden");
      } else {
        decBtn.classList.remove("hidden");
      }
    }
  }
}
