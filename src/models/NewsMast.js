import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const News = sequelize.define(
  "NewsMast",
  {
    Id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    UkeyId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Title: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    Descrption: {
      type: DataTypes.TEXT, // -1 length → use TEXT
      allowNull: true,
    },
    NewsDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    IsDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    Type: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  },
  {
    tableName: "NewsMast",
    timestamps: false,
  }
);

export default News;