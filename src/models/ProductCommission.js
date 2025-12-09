import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ProductCommission = sequelize.define(
  "ProductCommission",
  {
    ProductCommissionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ProductCguid: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    DealerLevelCguid: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    NewSaleCommission: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    RenewalCommission: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IpAddress: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    EntryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    UserName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    flag: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
  },
  {
    tableName: "ProductCommission",
    timestamps: false,
  }
);

export default ProductCommission;