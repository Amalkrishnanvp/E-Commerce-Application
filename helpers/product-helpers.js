const dbModule = require("../config/connection");
const essentials = require("../config/essentials");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
  // Function to add product
  addProduct: async (product) => {
    // Insert the product into the database and return the result
    const data = await dbModule
      .getDb()
      .collection(essentials.PRODUCT_COLLECTION)
      .insertOne(product);

    // Returns the entire data
    return data;
  },

  // Function to get all products
  getAllProducts: async () => {
    // Get all products
    const products = await dbModule
      .getDb()
      .collection(essentials.PRODUCT_COLLECTION)
      .find()
      .toArray();

    // Return products
    return products;
  },

  // Function to add image path to database
  addImagePath: async (productId, imagePath) => {
    // Add image path
    await dbModule
      .getDb()
      .collection(essentials.PRODUCT_COLLECTION)
      .updateOne({ _id: productId }, { $set: { ImagePath: imagePath } });
  },

  // Function to delete products
  deleteProduct: async (productId) => {
    // remove product from database
    const response = await dbModule
      .getDb()
      .collection(essentials.PRODUCT_COLLECTION)
      .deleteOne({ _id: new ObjectId(productId) });

    return response;
  },

  // Function to get product details
  getProductDetails: async (productId) => {
    const response = await dbModule
      .getDb()
      .collection(essentials.PRODUCT_COLLECTION)
      .findOne({ _id: new ObjectId(productId) });

    return response;
  },

  // Function to update product
  updateProduct: async (productId, productDetails) => {
    const response = await dbModule
      .getDb()
      .collection(essentials.PRODUCT_COLLECTION)
      .updateOne(
        { _id: new ObjectId(productId) },
        {
          $set: {
            Name: productDetails.Name,
            Category: productDetails.Category,
            Price: productDetails.Price,
          },
        }
      );

    return response;
  },

  // Function to get placed orders
  getPlacedOrders: async (params) => {
    const response = await dbModule
      .getDb()
      .collection(essentials.ORDER_COLLECTION)
      .find({ status: "placed" })
      .toArray();

    return response;
  },

  // Function to ship order
  shipOrder: async (orderId) => {
    const result = await dbModule
      .getDb()
      .collection(essentials.ORDER_COLLECTION)
      .updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { status: "shipped" } }
      );

    return result;
  },
};
