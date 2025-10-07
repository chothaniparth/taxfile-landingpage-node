import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const InquiryMast = sequelize.define(
  "InquiryMast",
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
    inquiryMode: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Name: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    CompanyName: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    Address: {
      type: DataTypes.STRING(800),
      allowNull: true,
    },
    City: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    State: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    PinCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Email: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    Mobile: {
      type: DataTypes.STRING(24),
      allowNull: true,
    },
    Message: {
      type: DataTypes.STRING(1000),
      allowNull: true,
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
    tableName: "InquiryMast",
    timestamps: false,
  }
);

export default InquiryMast;
