import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const DealerLevel = sequelize.define(
  "DealerLevel",
  {
    DealerLevelId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Cguid: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    LevelName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    CommissionPercentNew: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    CommissionPercentRenew: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    OverridePercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    TargetAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    Notes1: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    Notes2: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    flag: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    IpAddress: {
      type: DataTypes.STRING(100),
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
  },
  {
    tableName: "DealerLevel",
    timestamps: false,
  }
);

export default DealerLevel;
