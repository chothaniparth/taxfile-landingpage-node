import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const Category = sequelize.define(
  "mst_Category",
  {
    CategoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Assuming auto-increment based on typical usage for ID columns
      allowNull: false,
    },
    CategoryName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    SrNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    NoOfDocuments: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "mst_Category",
    timestamps: false,
  }
);

export default Category;
