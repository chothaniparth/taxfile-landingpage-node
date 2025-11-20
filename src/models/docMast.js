import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const DocMast = sequelize.define(
  "DocMast",
  {
    DocId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    DocUkeyId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    FileName: {
      type: DataTypes.STRING(400),   // multer will save file path or filename here
      allowNull: false,
    },
    Message: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    FileType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Master: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    MasterUkeyId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Link: {
      type: DataTypes.TEXT,          // since it’s nvarchar(max), use TEXT in Sequelize
      allowNull: true,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    IpAddress: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    EntryDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    UserName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    flag: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    CustomerID: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    FileSize: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "DocMast",
    timestamps: false, // because you already have EntryDate
  }
);

export default DocMast;