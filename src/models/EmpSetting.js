import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const EmpSetting = sequelize.define(
  "EmpSetting",
  {
    CRMEmpId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    ColumnId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    IpAddress: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    EntryDate: {
      type: DataTypes.STRING(100),
      allowNull: true,
    }
  },
  {
    tableName: "EmpSetting",
    timestamps: false,
  }
);

export default EmpSetting;
