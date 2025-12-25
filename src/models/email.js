import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const EmailMast = sequelize.define(
  "MailSetting",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    Email: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    MailServer: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    ServerName: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    IpAddress: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    EntryTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Flag: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
  },
  {
    tableName: "MailSetting",
    timestamps: false,
  }
);

export default EmailMast;