import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const AboutUs = sequelize.define(
  "AboutUsMast",
  {
    Id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    AboutUkeyId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    LongDetails: {
      type: DataTypes.TEXT, // nvarchar(max)
      allowNull: false,
    },
    Mission: {
      type: DataTypes.TEXT, // nvarchar(max)
      allowNull: false,
    },
    Vision: {
      type: DataTypes.TEXT, // nvarchar(max)
      allowNull: false,
    },
    Core1: {
      type: DataTypes.TEXT, // nvarchar(max)
      allowNull: false,
    },
    Core2: {
      type: DataTypes.TEXT, // nvarchar(max)
      allowNull: false,
    },
    Core3: {
      type: DataTypes.TEXT, // nvarchar(max)
      allowNull: false,
    },
    Core4: {
      type: DataTypes.TEXT, // nvarchar(max)
      allowNull: false,
    },
    Twitter: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    YT: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Linkedin: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Insta: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    FB: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Counter1: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    Counter2: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    Counter3: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    Counter4: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
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
    tableName: "AboutUsMast",
    timestamps: false,
  }
);

export default AboutUs;