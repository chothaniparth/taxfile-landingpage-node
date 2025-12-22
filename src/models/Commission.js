import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Commission = sequelize.define(
    "Commission",
    {
        CommissionID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        CommissionUkeyId : {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        TransactionUkeyId: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        ProductCguid: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        DealerCguid: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        DealerLevelCguid: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        CommissionPercent: {
            type: DataTypes.DECIMAL(5, 8),
            allowNull: true,
        },
        CommissionAmount: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: true,
        },
        IsOverride: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        OverrideFromDealerID: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        Status: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        PayoutCguid: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
    },
    {
        tableName: "Commission",
        timestamps: false,
    }
);

export default Commission;