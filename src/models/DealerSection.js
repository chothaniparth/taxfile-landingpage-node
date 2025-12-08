import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const DealerSection = sequelize.define(
  "dealersection",
  {
    Id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Cguid: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    Sectiontype: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    Notes: {
      type: DataTypes.TEXT, // nvarchar(-1) usually maps to TEXT
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
    tableName: "dealersection",
    timestamps: false,
  }
);

export default DealerSection;
