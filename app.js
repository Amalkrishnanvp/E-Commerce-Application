const express = require("express");
const path = require("path");
const app = express();
const port = 5000;
const hbs = require("hbs");
const fileUpload = require("express-fileupload");
const { connectToDb, getDb } = require("./config/connection");

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

// Use file upload
app.use(fileUpload());

// Connect to db
connectToDb();

// Use routes
app.use("/", userRouter);
app.use("/admin", adminRouter);

// Start server
app.listen(port, () => {
  console.log(`Server started running on port: ${port}`);
});
