import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const ComplaintMast = sequelize.define(
  "ComplaintMast",
  {
    ComplainIt: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    ComplaintUkeyId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    PartyName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ComplaintBy: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ContactNo: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    VisitingHours: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    Query: {
      type: DataTypes.STRING, // NVARCHAR(MAX) => DataTypes.STRING without length
      allowNull: false,
    },
    flag: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    IpAddress: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    EntryDate: {
      type: DataTypes.DATE, // SQL DATETIME
      allowNull: false,
    },
    UserName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "ComplaintMast",
    timestamps: false,
  }
);

export default ComplaintMast;
