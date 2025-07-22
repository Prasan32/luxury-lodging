import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CityState = sequelize.define('CityState', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    lat:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    lng:{
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: "city_state_info",
    timestamps: true
});

export default CityState;