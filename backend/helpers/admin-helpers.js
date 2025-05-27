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

  // Function to change order status
  changeOrderStatus: async (orderId, orderStatus) => {
    const response = await dbModule
      .getDb()
      .collection(essentials.ORDER_COLLECTION)
      .updateOne(
        {
          _id: new ObjectId(orderId),
        },
        {
          $set: {
            status: orderStatus,
          },
        }
      );

    if (response.modifiedCount > 0) {
      return { success: true, message: "Status updated" };
    } else {
      return { success: false, message: "Status update failed" };
    }
  },

  // Function to delete selected products
  deletedSelectedProducts: async (objectIds) => {
    console.log(objectIds);

    const response = await dbModule
      .getDb()
      .collection(essentials.PRODUCT_COLLECTION)
      .deleteMany({ _id: { $in: objectIds } });

    if (response.deletedCount > 0) {
      return {
        success: true,
        message: `${response.deletedCount} items deleted`,
      };
    } else {
      return {
        success: false,
        message: "Cannot delete items",
      };
    }
  },
};
