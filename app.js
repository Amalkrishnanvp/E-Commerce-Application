const express = require("express");
const hbs = require("hbs");

const app = express();
const port = 5000;

// Import routes
const indexRouter = require("./routes/index");

// Set view engine: handlebars
app.set("view engine", "hbs");

// Serve static files from 'public' folder
app.use(express.static("public"));

// Parse json bodies
app.use(express.json());

// Use routes
app.use("/", indexRouter);

// Start server
app.listen(port, () => {
  console.log(`Server started running on port: ${port}`);
});
