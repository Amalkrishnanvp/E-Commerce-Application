const express = require("express");
const path = require("path");
const app = express();
const port = process.env.port || 5000;
const hbs = require("hbs");
const fileUpload = require("express-fileupload");
const { connectToDb } = require("./config/connection");
const session = require("express-session");
const adminCreation = require("./adminCreation");

// Register a helper to add 1 to the index
hbs.registerHelper("addOne", (index) => {
  return index + 1;
});

// Register helper to format date
hbs.registerHelper("formatDate", function (dateString) {
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
});

// Register a helper to display products based on category
hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

// Helper function to show status based on payment method
hbs.registerHelper("paymentMethodClass", function (paymentMethod) {
  if (paymentMethod === "COD") {
    return "bg-yellow-100 text-yellow-800";
  } else {
    return "bg-green-100 text-green-800";
  }
});

// Helper function to get color based on status
hbs.registerHelper("getStatusColor", function getStatusColor(status) {
  switch (status) {
    case "Processing":
      return "bg-blue-100 text-blue-800";
    case "Placed":
      return "bg-purple-100 text-yellow-800";
    case "Shipped":
      return "bg-purple-100 text-purple-800";
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
});

// Helper function to set selected
hbs.registerHelper("isSelected", function (currentStatus, optionStatus) {
  return currentStatus === optionStatus ? "selected" : "";
});

hbs.registerHelper("shippingLabel", function (paymentMethod) {
  return paymentMethod === "COD" ? "₹0 (COD)" : "Free";
});

hbs.registerHelper("paymentStatus", function (paymentMethod, options) {
  if (paymentMethod === "COD") {
    return new hbs.handlebars.SafeString(`
      <div class="flex justify-between">
        <span class="text-gray-600">Payment Status</span>
        <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          To be collected
        </span>
      </div>
    `);
  } else {
    return new hbs.handlebars.SafeString(`
      <div class="flex justify-between">
        <span class="text-gray-600">Payment Status</span>
        <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Paid
        </span>
      </div>
    `);
  }
});

hbs.registerHelper("multiply", function (a, b) {
  return a * b;
});

// Register the partials directory
hbs.registerPartials(path.join(__dirname, "../frontend/views/partials"));

// Set view engine to hbs
app.set("view engine", "hbs");

// Set the views directory
app.set("views", path.join(__dirname, "../frontend/views"));

// Register the layout directory
app.set("view options", { layout: "../views/layouts/layout" });

// Import routes
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

// Serve static files from 'public' folder
app.use(express.static("../frontend/public"));

// Parse json bodies
app.use(express.json());

// Middleware to Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Use file upload
app.use(fileUpload());

// Use session
app.use(
  session({
    secret: "Key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 },
  })
);

// Pass session to all views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Use routes
app.use("/admin", adminRouter);
app.use("/", userRouter);

const startServer = async () => {
  try {
    // Connect to db
    await connectToDb();
    await adminCreation.createAdmin();

    // Start server
    app.listen(port, () => {
      console.log(`Server started running on port: ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB, exiting...", error);
    process.exit(1);
  }
};

startServer();
