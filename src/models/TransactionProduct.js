import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TransactionProduct = sequelize.define(
  "TransactionProduct",
  {
    TransactionProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    TransactionUkeyId: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    ProductCguid: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Rate: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    AmountExGST: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    GSTAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    GrossAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    Remarks: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    EntryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "TransactionProduct",
    timestamps: false,
  }
);

export default TransactionProduct;