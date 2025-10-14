import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const YTvideo = sequelize.define(
  "YTvideoMast",
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
    ProductUkeyId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    URL: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: "YTvideoMast",
    timestamps: false,
  }
);

export default YTvideo;