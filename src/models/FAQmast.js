import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const FAQ = sequelize.define(
  "FAQmast",
  {
    Id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    FaqUkeyId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Ques: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    Ans: {
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
    tableName: "FAQmast",
    timestamps: false,
  }
);

export default FAQ;
