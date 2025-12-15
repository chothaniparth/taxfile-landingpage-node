import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TransactionMast = sequelize.define(
  "TransactionMast",
  {
    TransactionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    TransactionUkeyId: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    InvoiceNo: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    InvoiceDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    PartyID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    DealerCguid: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    ProductCguid: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    TxnType: {
      type: DataTypes.STRING(100),
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
  },
  {
    tableName: "TransactionMast",
    timestamps: false,
  }
);

export default TransactionMast;