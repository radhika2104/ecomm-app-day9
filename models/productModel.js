const { Sequelize } = require("sequelize");
const { createDB } = require("../config/db.js");
const { DataTypes } = require("sequelize");
const orderModel = require("./orderModel");

const Product = createDB.define("product", {
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  name: DataTypes.STRING,
  price: DataTypes.DECIMAL,
  content: DataTypes.STRING,
});

module.exports = Product;
// Product.hasMany(orderModel, { foreignKey: "id" });
