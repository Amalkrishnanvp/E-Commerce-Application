function addToCart(productId) {
  $.ajax({
    url: "/add-to-cart/" + productId,
    method: "GET",
    success: (response) => {
      if (response.status) {
        alert("Product added to cart");
        let count = $("#cart-count").html();
        count = parseInt(count) + 1;
        $("#cart-count").html(count);
      }
    },
  });
}
