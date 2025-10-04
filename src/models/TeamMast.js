import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const Team = sequelize.define(
  "TeamMast",
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
    Name: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    Designation: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Links: {
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
    tableName: "TeamMast",
    timestamps: false,
  }
);

export default Team;