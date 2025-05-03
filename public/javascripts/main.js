document.addEventListener("DOMContentLoaded", () => {
  const mobileBtn = document.querySelector(".mobile-btn");
  const mobileMenu = document.querySelector("#mobile-menu");
  const dropdownDefaultButton = document.querySelector(
    "#dropdownDefaultButton"
  );
  const dropdown = document.querySelector("#dropdown");
  const userMenuButton = document.querySelector("#user-menu-button");
  const deleteModal = document.querySelector("#deleteModal");
  const deleteBtn = document.querySelector(".delete-btn");

  if (mobileBtn) {
    mobileBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  if (dropdownDefaultButton) {
    dropdownDefaultButton.addEventListener("click", () => {
      dropdown.classList.toggle("hidden");
    });
  }

  if (userMenuButton) {
    userMenuButton.addEventListener("click", () => {
      dropdown.classList.toggle("hide");
    });
  }

  const checkoutForm = document.getElementById("checkout-form");

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();

      $.ajax({
        url: "/place-order",
        method: "post",
        data: $("#checkout-form").serialize(),
        success: (response) => {
          if (response.codSuccess) {
            location.href = `/order-success?order_id=${response.orderId}`;
          } else {
            console.log(response);

            razorpayPayment(response);
          }
        },
      });
    });
  }

  function razorpayPayment(order) {
    var options = {
      key: "rzp_test_HV0g7SpzrvcYME", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Amal Products", //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: function (response) {
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);

        verifyPayment(response, order);
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name: "Gaurav Kumar", //your customer's name
        email: "gaurav.kumar@example.com",
        contact: "9000090000", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    let rzp1 = new Razorpay(options);
    rzp1.open();
  }

  function verifyPayment(payment, order) {
    $.ajax({
      url: "/verify-payment",
      data: {
        payment,
        order,
      },
      method: "post",
      success: (response) => {
        console.log("final: ", response);

        if (response.success) {
          location.href = `/order-success?order_id=${order.receipt}`;
        } else {
          alert("Payment failed");
        }
      },
    });
  }

  const userButton = document.querySelector("#user-button");

  userButton.addEventListener("click", () => {
    const dropdownMenu = document.getElementById("dropdown-menu");
    dropdownMenu.classList.toggle("hidden");
  });
});
