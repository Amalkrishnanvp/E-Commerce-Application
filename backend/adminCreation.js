const dbModule = require("./config/connection");
const essentials = require("./config/essentials");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

module.exports = {
  createAdmin: async () => {
    const db = dbModule.getDb();
    try {
      const adminCollection = await db.collection(essentials.ADMIN_COLLECTION);

      // Check if admin exists
      const adminExists = await adminCollection.findOne({ name: "admin" });

      if (!adminExists) {
        const password = "admin123";

        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert admin
        const adminData = {
          name: "admin",
          email: "admin@gmail.com",
          password: hashedPassword,
          role: "admin",
        };

        await adminCollection.insertOne(adminData);
        console.log("Admin created");
      } else {
        // return;
        // console.log("Admin already exists!");
        return;
      }
    } catch (error) {
      console.log("Error creating admin:", error);
    }
  },
};
