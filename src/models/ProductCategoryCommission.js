import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection()

const ProductCategoryCommission = sequelize.define(
    "ProductCategoryCommission",
    {
        ProductCategoryCommissionID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        CategoryID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        DealerLevelCguid: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        NewSaleCommission: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true
        },
        RenewalCommission: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true
        },
        IsActive: {
            type: DataTypes.BOOLEAN,
            allowNull: true
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
        tableName: "ProductCategoryCommission",
        timestamps: false
    }
)

export default ProductCategoryCommission;