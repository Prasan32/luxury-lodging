import axios from "axios";
import { config } from "../config/envConfig.js";
import logger from "../config/winstonLoggerConfig.js";

const PRICELABS_API_URL = `https://api.pricelabs.co/v1`;

const getListingPrice = async (listingList) => {
    const url = `${PRICELABS_API_URL}/listing_prices`;
    const requestBody = {
        "listings": listingList
    };

    const headers = {
        headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
            "X-API-Key": config.PRICELABS_API_KEY
        }
    };

    try {
        const response = await axios.post(url, requestBody, headers);
        const data = response.data;
        if (response.status !== 200) {
            logger.error(`[getListingPrice] Response status is ${response.status}`);
            logger.error(`[getListingPrice] Error fetching listing price from PriceLabs`, response.data);
            return null;
        }
        return data;
    } catch (error) {
        logger.error(`[getListingPrice] Error fetching listing price from PriceLabs`, error);
        return null;
    }
};

const PriceLabsClient = {
    getListingPrice
};

export default PriceLabsClient;