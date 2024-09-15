const dbModule = require("../config/connection");

module.exports = {
  // Function to add product
  addProduct: async (product) => {
    console.log(product);

    // Insert the product into the database and return the result
    const data = await dbModule
      .getDb()
      .collection("product")
      .insertOne(product);
    console.log("id: " + data.insertedId);
    
    // Returns the entire data
    return data;
  },
};
