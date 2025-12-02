import { DataTypes } from "sequelize";
import { dbConection } from "../config/db.js";

const sequelize = await dbConection();

const Birthday = sequelize.define(
    "tblBirthdayAnniversary",
    {
        Id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        Name: {
            type: DataTypes.STRING(400),
            allowNull: false,
        },
        RelationId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        Mobile: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        Email: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        Birthday: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        Anniversary: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        PartyId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        IsActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        RegionID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        Degree: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
    },
    {
        tableName: "tblBirthdayAnniversary",
        timestamps: false,
    }
)