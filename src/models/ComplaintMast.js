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
    PartyCGUID: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    OverBy: {
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
    CallerName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    TicketNo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    IsOver: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    OverDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    OverRemark: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
  },
  {
    tableName: "ComplaintMast",
    timestamps: false,
  }
);

export default ComplaintMast;
