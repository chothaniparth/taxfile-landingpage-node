import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const Vacancy = sequelize.define(
  "VacancyMast",
  {
    Id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    Title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    PostedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    NoofPost: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    Experience: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Details: {
      type: DataTypes.TEXT, // nvarchar(max)
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
    tableName: "VacancyMast",
    timestamps: false,
  }
);

export default Vacancy;
