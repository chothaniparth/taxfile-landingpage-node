import {dbConection} from '../config/db.js'

const sequelize = await dbConection();

const Category = sequelize.define('CategoryMast', {
    CategoryId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
    },
    CategoryName: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    IsActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    }
},{
    tableName: 'CategoryMast',
    timestamps: false,
});

export default Category;
