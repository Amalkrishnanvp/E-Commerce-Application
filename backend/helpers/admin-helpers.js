const dbModule = require("../config/connection");
const essentials = require("../config/essentials");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
  // Function for getting users list
  getUsers: async () => {
    const users = await dbModule
      .getDb()
      .collection(essentials.USER_COLLECTION)
      .find()
      .toArray();

    console.log(users);

    return users;
  },

  // Function to get user name 
  getUserName: async (userId) => {
    const user = await dbModule
      .getDb()
      .collection(essentials.USER_COLLECTION)
      .findOne({ _id: new ObjectId(userId) });

    return user ? user.name : "Unknown User";
  },
};
