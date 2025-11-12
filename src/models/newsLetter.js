import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const newsLetter = sequelize.define(
  "newsLetter",
  {
    Id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    Email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "newsLetter",
    timestamps: false,
  }
);

export default newsLetter;