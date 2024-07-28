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
    const accessToken = getAccessToken();
    if (!accessToken) {
        return null;
    }

    const url = `${HOSTAWAY_API_URL}/listings`;
    const headers = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Cache-Control": "no-cache",
        },
    };

    const response = await axios.get(url, headers);
    return response.data?.result;
};
