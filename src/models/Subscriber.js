import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Subscriber = sequelize.define('subscriber', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
}, {
    tableName: "subscriber",
    timestamps: true
});

export default Subscriber;