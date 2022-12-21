const express = require("express");
const app = express();
const { connectDB } = require("./config/db");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
connectDB();

const PORT = 5006;

// middlewares
app.use(express.json());
app.use(express.static("content"));
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);

app.listen(PORT, () => {
  console.log("server is running..", PORT);
});
