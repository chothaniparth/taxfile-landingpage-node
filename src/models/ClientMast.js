import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const ClientMast = sequelize.define(
  "ClientMast",
  {
    ClientId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    ClientUkeyId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Companyname: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    Remarks: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    Link: {
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
    tableName: "ClientMast",
    timestamps: false,
  }
);

export default ClientMast;