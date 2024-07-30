import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Listing from "./Listing.js";

const ListingImage = sequelize.define("Listing", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
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
    ulr: {
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

// Association
ListingImage.belongsTo(Listing, { foreignKey: 'id', as: 'listing' });

export default ListingImage;