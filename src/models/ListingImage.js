import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ListingImage = sequelize.define("Listing", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    listingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    caption: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    vrboCaption: {
        type: DataTypes.STRING,
        allowNull: true
    },
    airbnbCaption: {
        type: DataTypes.STRING,
        allowNull: true
    },
    url: {
        type: DataTypes.STRING
    },
   sortOrder:{
     type: DataTypes.INTEGER,
     allowNull: true,
   }
}, {
    tableName: "listing_image",
    timestamps: true
});


export default ListingImage;