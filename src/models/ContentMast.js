import { DataTypes } from "sequelize";
import { dbConection } from "../config/db";

const sequelize = await dbConection();

const ContentMast = sequelize.define(
  "ContentMast",
  {
    ContentId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    ContentUkId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    ContentTitle: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    ContentDetails: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    EntryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    IpAddress: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    UserName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    flag: {
      type: DataTypes.STRING(4),
      allowNull: true,
    }
  },
  {
    tableName: "ContentMast",
    timestamps: false,
  }
);

export default ContentMast;