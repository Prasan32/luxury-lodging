import axios from "axios";
import { config } from "../config/envConfig.js";
import logger from "../config/winstonLoggerConfig.js";

const HOSTAWAY_API_URL = `https://api.hostaway.com/v1`;

const getAccessToken = async () => {
    const url = `${HOSTAWAY_API_URL}/accessTokens`;
    const requestBody = {
        grant_type: "client_credentials",
        client_id: config.HOSTAWAY_CLIENT_ID,
        client_secret: config.HOSTAWAY_CLIENT_SECRET,
        scope: "general",
    };

    const headers = {
        headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };

    try {
        const response = await axios.post(url, requestBody, headers);
        return response.data?.access_token;
    } catch (error) {
        logger.error(`Error creating access token`, error);
        return null;
    }
};


const getListings = async () => {
    const url = `${HOSTAWAY_API_URL}/listings`;

    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return null;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Cache-Control": "no-cache",
            },
        });

        return response.data?.result;
    } catch (error) {
        logger.error(`Error fetching listings`, error);
        return null;
    }
};


const getListingInfo = async (id) => {
    const url = `${HOSTAWAY_API_URL}/listings/${id}`;
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return null;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Cache-Control": "no-cache",
            },
        });

        return response.data?.result;
    } catch (error) {
        logger.error(`Error fetching listing info for id ${id}`, error);
        return null;
    }
};

const checkAvailability = async (accessToken, listingId, checkInDate, checkOutDate) => {
    const url = `${HOSTAWAY_API_URL}/reservations?listingId=${listingId}`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Cache-Control": "no-cache",
            },
        });

        const reservations = response.data.result;
        const isAvailable = reservations.every(reservation => {

            const reservationCheckInStart = new Date(reservation.arrivalStartDate);
            const reservationCheckInEnd = new Date(reservation.arrivalEndDate);
            const reservationCheckOutStart = new Date(reservation.departureStartDate);
            const reservationCheckOutEnd = new Date(reservation.departureEndDate);

            const requestedCheckIn = new Date(checkInDate);
            const requestedCheckOut = new Date(checkOutDate);

            return (
                (
                    requestedCheckOut <= reservationCheckInStart &&
                    requestedCheckOut <= reservationCheckInEnd

                ) &&
                (
                    requestedCheckIn >= reservationCheckOutStart &&
                    requestedCheckIn >= reservationCheckOutEnd
                )
            );
        });

        return isAvailable;
    } catch (error) {
        logger.error(`Error checking availability of listing for id ${listingId}`, error);
        return null;
    }
};

const HostAwayClient = {
    getAccessToken,
    getListings,
    getListingInfo,
    checkAvailability
};

export default HostAwayClient;