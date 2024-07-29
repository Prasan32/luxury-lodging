import axios from "axios";
import { config } from "../config/envConfig.js";

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
        console.error(`Error creating access token`, error);
        return null;
    }
};


export const getListings = async () => {
    const url = `${HOSTAWAY_API_URL}/listings`;

    try {
        const accessToken = getAccessToken();
        if (!accessToken) return null;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Cache-Control": "no-cache",
            },
        });

        return response.data?.result;
    } catch (error) {
        console.error(`Error fetching listings`, error);
        return null;
    }
};


export const getListingInfo = async (id) => {
    const url = `${HOSTAWAY_API_URL}/listings/${id}`;
    try {
        const accessToken = getAccessToken();
        if (!accessToken) return null;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Cache-Control": "no-cache",
            },
        });

        return response.data?.result;
    } catch (error) {
        console.error(`Error fetching listing info for id ${id}`, error);
        return null;
    }
};