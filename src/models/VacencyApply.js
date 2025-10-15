import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const VacancyApply = sequelize.define(
  "VacancyApply",
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
    vacencyMastUkeyId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    Mobile: {
      type: DataTypes.STRING(24),
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        isEmail: true, // Ensures valid email format
      },
    },
    FileName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    IpAddress: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    EntryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    UserName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    flag: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
  },
  {
    tableName: "VacancyApply",
    timestamps: false,
  }
);

export default VacancyApply;
