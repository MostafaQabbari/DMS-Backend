const express = require("express");
const mongoose = require("mongoose");
const { jwtSecret } = require("./config/config");
const authRoutes = require("./routes/auth");

const app = express();

mongoose
  .connect("mongodb+srv://mkabary8:O8uafwuq79PBkJoJ@cluster1.xnqqhnm.mongodb.net/users", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(error);
  });

app.use(express.json());

app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});