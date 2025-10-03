import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const SubCategory = sequelize.define(
  "SubCateMast",
  {
    SubcatId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    SubUkeyId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    SubCateName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    CategoryId: {
      type: DataTypes.BIGINT,
      allowNull: false,
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
    tableName: "SubCateMast",
    timestamps: false,
  }
);

export default SubCategory;
