import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const ProductContent = sequelize.define(
  "ProductContent",
  {
    ContentId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    ContentUkeyId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    ProductUkeyId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Details: {
      type: DataTypes.TEXT, // nvarchar(max)
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
    tableName: "ProductContent",
    timestamps: false,
  }
);

export default ProductContent;
