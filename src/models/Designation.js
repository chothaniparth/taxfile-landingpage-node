import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const Designation = sequelize.define(
  "Designation",
  {
    DesignationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    DesignationName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ShortCode: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    IsSelect: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    tableName: "Designation",
    timestamps: false,
  }
);

export default Designation;
