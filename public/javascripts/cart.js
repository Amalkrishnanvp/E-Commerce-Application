function changeQuantity(cartId, proId, count) {
  const quantity = document
    .getElementById(proId)
    .querySelector(".quantity-element").textContent;

  $.ajax({
    url: "/change-product-quantity",
    data: {
      cartId: cartId, // Changed from 'cart'
      productId: proId, // Changed from 'product'
      count: count,
      quantity: quantity,
    },
    method: "post",
    success: (response) => {
      // Fixed lowercase 'response'
      if (response.removeProduct) {
        // alert("Product removed from cart");
        location.reload();
      } else {
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
          }
        }
      }
    },
    error: (err) => {
      console.error("Error:", err);
    },
  });
}

async function removeProd(cartId, productId) {
  try {
    const response = await fetch("/remove-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartId,
        productId,
      }),
    });

    const result = await response.json();

    if (result.success) {
      alert("Product removed from cart");
      location.reload();
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}
