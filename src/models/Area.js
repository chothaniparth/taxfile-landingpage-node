import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const Area = sequelize.define(
  "area",
  {
    AreaID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    CityID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    AreaName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "area",
    timestamps: false,
  }
);

export default Area;
