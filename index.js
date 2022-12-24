const express = require("express");
const app = express();
const { connectDB } = require("./config/db");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

require("dotenv").config();
const PORT = process.env.PORT;

const specs = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Photo store API",
      version: "1.0.0",
      description: "Buy/Sell Photos",
    },
    servers: [{ url: process.env.BASE_URL }],
  },
  apis: ["./routes/*.js"],
});

connectDB();

// middlewares

// to listen for api related docs at url - http://localhost:5050/api-docs/
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.json());
app.use(express.static("content"));
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);

app.listen(PORT, () => {
  console.log("server is running..", PORT);
});
