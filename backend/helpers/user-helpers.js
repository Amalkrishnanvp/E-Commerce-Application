const { response } = require("express");
const dbModule = require("../config/connection");
const essentials = require("../config/essentials");
const bcrypt = require("bcryptjs");
const { Collection, ReturnDocument } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const saltRounds = 10;
const Razorpay = require("razorpay");
const crypto = require("crypto");

module.exports = {
  // Function for new user sign up
  doSignup: async (data) => {
    // new user's data
    const { name, email, password } = data;
    const db = dbModule.getDb();

    try {
      const usersCollection = db.collection(essentials.USER_COLLECTION);

      // Check if the user already exists
      const userExists = await usersCollection.findOne({ name });

      if (userExists) {
        return { success: false, message: "User already exists" };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Add new user with hashed password
      const userData = {
        name,
        email,
        password: hashedPassword,
        role: "user",
      };

      await usersCollection.insertOne(userData);

      return {
        success: true,
        message: "User registered successfully",
        userData,
      };
    } catch (error) {
      console.error("Error during user registration: ", error);
      return { success: false, message: "Error registering user" };
    }
  },

  // Function for existing user login
  doLogin: async (data, res) => {
    const { email, password } = data;

    const db = dbModule.getDb();

    try {
      const adminCollection = db.collection(essentials.ADMIN_COLLECTION);
      const usersCollection = db.collection(essentials.USER_COLLECTION);

      // Check if the login user is admin
      let user = await adminCollection.findOne({ email });

      // If not admin, check if the user is a regular user
      if (!user) {
        // Check if the user is a regular user
        user = await usersCollection.findOne({ email });
      }

      // If the user is found, compare the provided password with hashed passowrd
      if (user) {
        if (user.role === "admin") {
          if (user.password === password) {
            return { logged: true, role: "admin", userData: user };
          } else {
            return { logged: false, message: "Incorrect password" };
          }
        } else if (user.role === "user") {
          const match = await bcrypt.compare(password, user.password);

          if (!match) {
            return { logged: false, message: "Incorrect password" };
          }

          return { logged: true, role: "user", userData: user };
        }
      } else {
        return {
          logged: false,
          message: "There is no user with provided username",
        };
      }
    } catch (error) {
      console.error("Error logging in", error);
      return { logged: false, message: "Error loggin in" };
    }
  },

  // Function to add product to cart
  addToCart: async (productId, userId) => {
    let productObj = {
      item: new ObjectId(productId),
      quantity: 1,
    };

    let userCart = await dbModule
      .getDb()
      .collection(essentials.CART_COLLECTION)
      .findOne({ user: new ObjectId(userId) });

    if (userCart) {
      console.log(userCart.products);

      let productExist = userCart.products.findIndex((product) => {
        return product.item.equals(new ObjectId(productId));
      });
      console.log(productExist);

      if (productExist != -1) {
        const response = await dbModule
          .getDb()
          .collection(essentials.CART_COLLECTION)
          .updateOne(
            {
              user: new ObjectId(userId),
              "products.item": new ObjectId(productId),
            },
            {
              $inc: { "products.$.quantity": 1 },
            }
          );

        return response;
      } else {
        const response = await dbModule
          .getDb()
          .collection(essentials.CART_COLLECTION)
          .updateOne(
            { user: new ObjectId(userId) },
            {
              $push: { products: productObj },
            }
          );

        return response;
      }
    } else {
      let cartObj = {
        user: new ObjectId(userId),
        products: [productObj],
      };
      // create cart for user
      const response = await dbModule
        .getDb()
        .collection(essentials.CART_COLLECTION)
        .insertOne(cartObj);
    }

    return response;
  },

  // Function to get cart products
  getCartProducts: async (userId) => {
    let cartItems = await dbModule
      .getDb()
      .collection(essentials.CART_COLLECTION)
      .aggregate([
        {
          $match: { user: new ObjectId(userId) },
        },
        {
          $unwind: "$products",
        },
        {
          $project: {
            item: "$products.item",
            quantity: "$products.quantity",
          },
        },
        {
          $lookup: {
            from: essentials.PRODUCT_COLLECTION,
            localField: "item",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $project: {
            item: 1,
            quantity: 1,
            product: { $arrayElemAt: ["$product", 0] },
          },
        },
      ])
      .toArray();

    return cartItems;
  },

  // function to get cart count
  getCartCount: async (userId) => {
    let count = 0;
    let cart = await dbModule
      .getDb()
      .collection(essentials.CART_COLLECTION)
      .findOne({ user: new ObjectId(userId) });

    if (cart) {
      count = cart.products.length;
    }

    return count;
  },

  // function to change product quantity
  changeProductQuantity: async (details) => {
    details.count = parseInt(details.count);
    details.quantity = parseInt(details.quantity);

    try {
      if (details.count == -1 && details.quantity == 1) {
        const response = await dbModule
          .getDb()
          .collection(essentials.CART_COLLECTION)
          .updateOne(
            { _id: new ObjectId(details.cartId) },
            {
              $pull: { products: { item: new ObjectId(details.productId) } },
            }
          );

        return { removeProduct: true };
      } else {
        const response = await dbModule
          .getDb()
          .collection(essentials.CART_COLLECTION)
          .updateOne(
            {
              _id: new ObjectId(details.cartId),
              "products.item": new ObjectId(details.productId),
            },
            {
              $inc: { "products.$.quantity": details.count },
            }
          );

        // Then fetch the updated cart to get the new quantity
        const cart = await dbModule
          .getDb()
          .collection(essentials.CART_COLLECTION)
          .findOne({
            _id: new ObjectId(details.cartId),
          });

        if (cart) {
          const product = cart.products.find(
            (p) => p.item.toString() === details.productId
          );
          return {
            updated: true,
            newQuantity: product.quantity,
          };
        } else {
          return { updated: false };
        }
      }
    } catch (err) {
      console.error("DB Error:", err);
      return { updated: false };
    }
  },

  // function to remove product
  removeProduct: async (data) => {
    const cartId = data.cartId;
    const productId = data.productId;

    const response = await dbModule
      .getDb()
      .collection(essentials.CART_COLLECTION)
      .updateOne(
        { _id: new ObjectId(cartId) },
        {
          $pull: { products: { item: new ObjectId(productId) } },
        }
      );

    if (response.modifiedCount === 1) {
      return {
        success: true,
        message: "Product removed successfully",
        removedCount: 1,
      };
    } else {
      return {
        success: false,
        message: "Product not found in cart",
        removedCount: 0,
      };
    }
  },

  // function to get total amount
  getTotalAmount: async (userId) => {
    let total = await dbModule
      .getDb()
      .collection(essentials.CART_COLLECTION)
      .aggregate([
        {
          $match: { user: new ObjectId(userId) },
        },
        {
          $unwind: "$products",
        },
        {
          $project: {
            item: "$products.item",
            quantity: "$products.quantity",
          },
        },
        {
          $lookup: {
            from: essentials.PRODUCT_COLLECTION,
            localField: "item",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $project: {
            item: 1,
            quantity: 1,
            product: { $arrayElemAt: ["$product", 0] },
            price: { $toDouble: { $arrayElemAt: ["$product.Price", 0] } },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ["$quantity", "$price"] } },
          },
        },
      ])
      .toArray();
    return total[0].total;
  },

  // function to place order
  placeOrder: async (orderDetails, products, totalPrice, userId) => {
    console.log(orderDetails, products, totalPrice);
    let status =
      orderDetails["payment-method"] === "COD" ? "placed" : "pending";

    let orderObj = {
      deliveryDetails: {
        mobile: orderDetails.mobile,
        address: orderDetails.address,
        pincode: orderDetails.pincode,
      },
      userId: new ObjectId(orderDetails.userId),
      paymentMethod: orderDetails["payment-method"],
      products: products,
      status: status,
      totalAmount: totalPrice,
      date: new Date(),
    };

    // create order object for placing order
    const response = await dbModule
      .getDb()
      .collection(essentials.ORDER_COLLECTION)
      .insertOne(orderObj);

    const result = await dbModule
      .getDb()
      .collection(essentials.CART_COLLECTION)
      .deleteOne({ user: new ObjectId(userId) });

    console.log("hello", response);

    return response;
  },

  // function to get cart products list
  getCartProductList: async (userId) => {
    let cart = await dbModule
      .getDb()
      .collection(essentials.CART_COLLECTION)
      .findOne({ user: new ObjectId(userId) });

    return cart.products;
  },

  // function get user orders
  getUserOrders: async (userId) => {
    const orders = await dbModule
      .getDb()
      .collection(essentials.ORDER_COLLECTION)
      .find({
        userId: new ObjectId(userId),
      })
      .toArray();

    console.log(orders);
    return orders;
  },

  // function to get ordered products list
  getOrderProducts: async (orderId) => {
    let orderItems = await dbModule
      .getDb()
      .collection(essentials.ORDER_COLLECTION)
      .aggregate([
        {
          $match: { _id: new ObjectId(orderId) },
        },
        {
          $unwind: "$products",
        },
        {
          $project: {
            item: "$products.item",
            quantity: "$products.quantity",
          },
        },
        {
          $lookup: {
            from: essentials.PRODUCT_COLLECTION,
            localField: "item",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $project: {
            item: 1,
            quantity: 1,
            product: { $arrayElemAt: ["$product", 0] },
          },
        },
      ])
      .toArray();

    return orderItems;
  },

  // function to get a single order details
  getSingleOrder: async (orderId) => {
    orderId = orderId.toString();
    orderId = orderId.trim();
    const objectId = new ObjectId(orderId);
    let order = await dbModule
      .getDb()
      .collection(essentials.ORDER_COLLECTION)
      .findOne({ _id: objectId });

    return order;
  },

  // function to generate razor pay
  generateRazorpay: async (orderId, total) => {
    let instance = new Razorpay({
      key_id: "rzp_test_HV0g7SpzrvcYME",
      key_secret: "IEcMUmmMv0rwCgolrDX4NzN6",
    });

    let options = {
      amount: total * 100,
      currency: "INR",
      receipt: orderId,
    };

    const order = await instance.orders.create(options);

    return order;
  },

  // function to verify payment
  verifyPayment: async (details) => {
    let hmac = crypto.createHmac("sha256", "IEcMUmmMv0rwCgolrDX4NzN6");

    hmac.update(
      details.payment.razorpay_order_id +
        "|" +
        details.payment.razorpay_payment_id
    );
    hmac = hmac.digest("hex");

    if (hmac == details.payment.razorpay_signature) {
      return true;
    } else {
      return false;
    }
  },

  // function to change payment status
  changePaymentStatus: async (orderId) => {
    const response = await dbModule
      .getDb()
      .collection(essentials.ORDER_COLLECTION)
      .updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            status: "placed",
          },
        }
      );

    return response;
  },
};
