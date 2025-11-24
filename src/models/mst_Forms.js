import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const Forms = sequelize.define(
  "mst_Forms",
  {
    FormsID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    FormName: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Format: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    SrNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    NoOfDownloads: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "mst_Forms",
    timestamps: false,
  }
);

export default Forms;
