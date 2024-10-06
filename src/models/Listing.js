import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

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
    personCapacity: {
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
    },
    roomType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bathroomType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bedroomsNumber: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    bedsNumber: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    bathroomsNumber: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    houseRules: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: "listing",
    timestamps: true
});



export default Listing;