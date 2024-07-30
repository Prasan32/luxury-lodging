import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ListingAmenity = sequelize.define("ListingAmenity", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    listingId: {
        type: DataTypes.INTEGER,
    },
    amenityId: {
        type: DataTypes.INTEGER,
    },
    amenityName: {
        type: DataTypes.STRING,
    }
}, {
    tableName: "listing_amenity",
    timestamps: true
});


export default ListingAmenity;