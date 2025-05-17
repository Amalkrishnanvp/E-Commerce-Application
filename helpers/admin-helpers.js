const dbModule = require("../config/connection");
const essentials = require("../config/essentials");

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
};
