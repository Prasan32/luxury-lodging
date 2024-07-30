import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import ListingImage from "./ListingImage.js";

const Listing = sequelize.define("Listing", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    propertyType: {
        type: DataTypes.STRING,
        defaultValue: "NOT SPECIFIED",
    },
    externalListingName: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.FLOAT,
    },
    guestsIncluded: {
        type: DataTypes.INTEGER,
    },
    priceForExtraPerson: {
        type: DataTypes.FLOAT,
    },
    currencyCode: {
        type: DataTypes.STRING,
    },
    internalListingName: {
        type: DataTypes.STRING,
    },
    country:{
        type: DataTypes.STRING,
    },
    countryCode:{
        type: DataTypes.STRING,
    },
    state:{
        type: DataTypes.STRING,
    },
    city:{
        type: DataTypes.STRING,
    },
    street:{
        type: DataTypes.STRING,
    },
    zipCode:{
        type: DataTypes.STRING,
    },
    lat:{
        type: DataTypes.FLOAT
    },
    lng:{
        type: DataTypes.FLOAT
    },
    checkInTimeStart:{
        type: DataTypes.INTEGER
    },
    checkInTimeEnd:{
        type: DataTypes.INTEGER
    },
    checkOutTime:{
        type: DataTypes.INTEGER
    },
    wifiUsername:{
        type: DataTypes.STRING
    },
    wifiPassword:{
        type: DataTypes.STRING
    }
}, {
    tableName: "listing",
    timestamps: true
});

// Association
Listing.hasMany(ListingImage, { foreignKey: 'id', as: 'images' });
ListingImage.belongsTo(Listing, { foreignKey: 'id', as: 'listing' });

export default Listing;