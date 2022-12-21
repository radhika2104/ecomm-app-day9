const { Sequelize } = require("sequelize");
const { createDB } = require("../config/db.js");
const { DataTypes } = require("sequelize");

const User = createDB.define("user", {
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  isSeller: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = User;
