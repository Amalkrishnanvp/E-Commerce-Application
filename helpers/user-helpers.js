const dbModule = require("../config/connection");
const essentials = require("../config/essentials");
const bcrypt = require("bcryptjs");

const saltRounds = 10;

module.exports = {
  // Function for new user sign up
  doSignup: async (data) => {
    console.log(data);

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
      console.log(userData);

      await usersCollection.insertOne(userData);

      return { success: true, message: "User registered successfully" };
    } catch (error) {
      console.error("Error during user registration: ", error);
      return { success: false, message: "Error registering user" };
    }
  },
};
