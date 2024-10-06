const { response } = require("express");
const dbModule = require("../config/connection");
const essentials = require("../config/essentials");
const bcrypt = require("bcryptjs");
const ObjectId = require("mongodb").ObjectId;
const saltRounds = 10;

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
    let userCart = await dbModule
      .getDb()
      .collection(essentials.CART_COLLECTION)
      .findOne({ user: new ObjectId(userId) });

    if (userCart) {
      const response = await dbModule
        .getDb()
        .collection(essentials.CART_COLLECTION)
        .updateOne(
          { user: new ObjectId(userId) },
          {
            $push: { products: new ObjectId(productId) },
          }
        );
    } else {
      let cartObj = {
        user: new ObjectId(userId),
        products: [new ObjectId(productId)],
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
          $lookup: {
            from: essentials.PRODUCT_COLLECTION,
            let: { productList: "$products" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$productList"],
                  },
                },
              },
            ],
            as: "cartItems",
          },
        },
      ])
      .toArray();

    return cartItems[0].cartItems;
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
};
