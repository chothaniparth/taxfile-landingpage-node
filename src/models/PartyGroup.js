import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const PartyGroup = sequelize.define(
  "PartyGroup",
  {
    PartyGroupId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    GroupUkeyId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    PartyGroupName: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    IpAddress: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    EntryDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    tableName: "PartyGroup",
    timestamps: false,
  }
);

export default PartyGroup;
