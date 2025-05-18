const dbModule = require("./config/connection");
const essentials = require("./config/essentials");

module.exports = {
  adminCreation: async () => {
    const db = dbModule.getDb();
    try {
      const adminCollection = await db.collection(essentials.adminCollection);

      // Check if admin exists
      const adminExists = await adminCollection.findOne({ name: "admin" });

      if (!adminExists) {
        // Insert admin
        const adminData = {
          name: "admin",
          email: "admin@gmail.com",
          role: "admin",
        };

        await adminCollection.insertOne({ adminData });
        console.log("Admin created");
      } else {
        return;
        console.log("Admin already exists!");
      }
    } catch (error) {
      console.log("Error creating admin:", error);
    }
  },
};
