import { DataTypes } from "sequelize";
import { getMasterConnection } from "../config/db.js";

const sequelize = await getMasterConnection();

const Users = sequelize.define(
  "Users",
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
    Password: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "Users",
    timestamps: false,
  }
);

export default Users;
