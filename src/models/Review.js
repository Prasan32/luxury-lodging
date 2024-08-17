import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Review = sequelize.define('review', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    listingId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    review: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: "review",
    timestamps: true
});

export default Review;