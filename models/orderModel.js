const { Sequelize } = require("sequelize");
const { createDB } = require("../config/db.js");
const { DataTypes } = require("sequelize");
const userModel = require("./userModel");
const productModel = require("./productModel");

const Order = createDB.define("order", {
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  productId: DataTypes.INTEGER,
  buyerId: DataTypes.INTEGER,
});

module.exports = Order;
// Order.belongsTo(userModel, { foreignKey: "buyerId" });
// Order.belongsTo(productModel, { foreignKey: "productId" });
