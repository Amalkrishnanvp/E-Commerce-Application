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

    console.log(response);

    return response;
  },
};
