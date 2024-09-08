import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PaymentInfo = sequelize.define("PaymentInfo", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    guestName: {
        type: DataTypes.STRING
    },
    guestEmail: {
        type: DataTypes.STRING
    },
    guestPhone: {
        type: DataTypes.STRING
    },
    listingId: {
        type: DataTypes.INTEGER,
    },
    checkInDate: {
        type: DataTypes.STRING,
    },
    checkOutDate: {
        type: DataTypes.STRING,
    },
    guests: {
        type: DataTypes.INTEGER,
    },
    paymentIntentId: {
        type: DataTypes.STRING,
    },
    customerId: {
        type: DataTypes.STRING,
    },
    paymentMethod: {
        type: DataTypes.STRING,
    },
    amount: {
        type: DataTypes.FLOAT,
    },
    currency: {
        type: DataTypes.STRING,
    },
    paymentStatus: {
        type: DataTypes.STRING,
    },
    reservationId: {
        type: DataTypes.STRING,
    }
}, {
    tableName: "payment_info",
    timestamps: true
});



export default PaymentInfo;