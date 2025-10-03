import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const Users = sequelize.define(
  "AdminLogin",
  {
    UserId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    UserUkeyId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Email: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Mobile1: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    Mobile2: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    CustId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Password: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    UserName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
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
  },
  {
    tableName: "AdminLogin",
    timestamps: false,
  }
);

export default Users;
