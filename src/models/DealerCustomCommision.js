import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const DealerCustomCommission = sequelize.define(
  "DealerCustomCommission",
  {
    DealerCustomCommissionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    DealerCguid: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    ProductCguid: {
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
    tableName: "DealerCustomCommission",
    timestamps: false,
  }
);

export default DealerCustomCommission;