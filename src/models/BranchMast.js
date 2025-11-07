import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const BranchMast = sequelize.define(
  "BranchMast",
  {
    BranchId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    BranchUkeyId: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Link: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    BranchName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    City: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Add1: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    ContactPerson: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    Email: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    Mode: {
      type: DataTypes.STRING(100),
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
    tableName: "BranchMast",
    timestamps: false,
  }
);

export default BranchMast;