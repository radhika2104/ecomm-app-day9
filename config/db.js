const { Sequelize } = require("sequelize");

const createDB = new Sequelize("test-db", "user", "pass", {
  dialect: "sqlite",
  host: "./config/db.sqlite",
});

const connectDB = () => {
  createDB
    .sync()
    .then(() => {
      console.log("connected to db");
    })
    .catch((e) => {
      console.log("db connecteion failed ", e);
    });
};

module.exports = { createDB, connectDB };
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
userModel.hasMany(orderModel, { foreignKey: "id" });
orderModel.belongsTo(userModel, { foreignKey: "buyerId" });
