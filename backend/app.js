const express = require("express");
const path = require("path");
const app = express();
const port = 5000;
const hbs = require("hbs");
const fileUpload = require("express-fileupload");
const { connectToDb } = require("./config/connection");
const session = require("express-session");

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

// Set view engine to hbs
app.set("view engine", "hbs");

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Register the layout directory
app.set("view options", { layout: "layouts/layout" });

// Register the partials directory
hbs.registerPartials(path.join(__dirname, "views/partials"));

// Import routes
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

// Serve static files from 'public' folder
app.use(express.static("public"));

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

// Connect to db
connectToDb();

// Use routes
app.use("/admin", adminRouter);
app.use("/", userRouter);

// Start server
app.listen(port, () => {
  console.log(`Server started running on port: ${port}`);
});
