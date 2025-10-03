import { DataTypes } from "sequelize";
import { getMasterConnection } from "../config/db.js";

const sequelize = await getMasterConnection();

const Carousel = sequelize.define(
  "carouselmast",
  {
    Id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    UkeyId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Title: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    IsDoc: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    OrderId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    UserName: {
      type: DataTypes.STRING(50),
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
    flag: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
  },
  {
    tableName: "carouselmast",
    timestamps: false,
  }
);

export default Carousel;
