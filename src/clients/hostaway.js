import axios from "axios";
import { config } from "../config/envConfig.js";
import logger from "../config/winstonLoggerConfig.js";
import { getCurrentDateTime } from "../helpers/date.js";

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
    const limit = 100; // Adjust as per Hostaway's API limits
    let offset = 0;
    let hasMore = true;
    const allListings = [];

    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return null;

        while (hasMore) {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Cache-Control": "no-cache",
                },
                params: {
                    limit,
                    offset,
                },
            });

            const listings = response.data?.result || [];
            allListings.push(...listings);

            if (listings.length < limit) {
                hasMore = false;
            } else {
                offset += limit;
            }
        }

        return allListings;
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
        checkInDate = new Date(checkInDate);
        checkOutDate = new Date(checkOutDate);

        // Function to check if two date ranges overlap
        function isOverlap(start1, end1, start2, end2) {
            return start1 < end2 && start2 < end1;
        }

        // Check each reservation for overlaps
        for (const reservation of reservations) {
            const reservationCheckIn = new Date(reservation.arrivalDate);
            const reservationCheckOut = new Date(reservation.departureDate);
            
            const validReservationStatus = ["new", "modified", "ownerStay"];
            if(validReservationStatus.includes(reservation.status)){
                if (isOverlap(checkInDate, checkOutDate, reservationCheckIn, reservationCheckOut)) {
                    return false;
                }
            }
        }

        return true;
    } catch (error) {
        logger.error(`Error checking availability of listing for id ${listingId}`, error);
        return null;
    }
};

const calculatePrice = async (listingId, checkIn, checkOut, guests, reservationCouponId) => {
    const url = `${HOSTAWAY_API_URL}/listings/${listingId}/calendar/priceDetails`;
    const requestBody = {
        startingDate: new Date(checkIn),
        endingDate: new Date(checkOut),
        numberOfGuests: guests,
        verion: 2,
        reservationCouponId: reservationCouponId
    };
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return null;

        const response = await axios.post(url, requestBody, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Cache-Control": "no-cache",
            },
        });

        return response.data?.result;
    } catch (error) {
        logger.error(`Error calculating price of listingId: ${listingId} for [${checkIn}-${checkOut}][guests:${guests}]`, error);
        return null;
    }
}

const getCalendar = async (listingId, startDate) => {
    const url = `${HOSTAWAY_API_URL}/listings/${listingId}/calendar?startDate=${startDate}`;
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
        logger.error(`Error fetching calendar of listing for id ${listingId}`, error);
        return null;
    }
};

const getAmenities = async () => {
    const url = `${HOSTAWAY_API_URL}/amenities`;
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
        logger.error(`Error fetching amenities`, error);
        return null;
    }
};

const getCountries = async () => {
    const url = `${HOSTAWAY_API_URL}/countries`;
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
        logger.error(`Error fetching countries`, error);
        return null;
    }
}

const getReviews = async (type) => {
    const url = `${HOSTAWAY_API_URL}/reviews?type=${type}`;
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
        logger.error(`Error fetching reviews`, error);
        return null;
    }
}

const getTopReviews = async () => {
    const url = `${HOSTAWAY_API_URL}/reviews?type=guest-to-host&sortOrder=desc`;
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
        logger.error(`Error fetching reviews`, error);
        return null;
    }
}

const createHostawayReservation = async (reservationObj) => {
    const requestBody = createReservationRequestObj(reservationObj);
    const url = `${HOSTAWAY_API_URL}/reservations?forceOverbooking=1`;

    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return null;

        const response = await axios.post(url, requestBody, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Cache-Control": "no-cache",
            },
        });

        if (response.statusCode === 200 || response.statusCode === 201) {
            logger.info(`Reservation created successfully`);
            logger.info(`Reservation object from hostaway: ${JSON.stringify(response.data)}`);
        }
        return response.data?.result;
    } catch (error) {
        logger.error(`Error creating reservation: ${JSON.stringify(requestBody)} `, error);
        return null;
    }
};

const createReservationRequestObj = (reservationObj) => {
    const {
        listingId, guestName, guestEmail, guests, checkInDate,
        checkOutDate, guestPhone, amount, currency, paymentMethod,
        couponName
    } = reservationObj;

    const guestFirstName = guestName.split(' ')[0];
    const guestLastName = guestName.split(' ')[1];

    const reservationRequestObj = {
        listingMapId: listingId,
        channelId: 2000,
        guestName: guestName,
        guestFirstName,
        guestLastName,
        guestEmail,
        numberOfGuests: guests,
        arrivalDate: checkInDate,
        departureDate: checkOutDate,
        phone: guestPhone,
        totalPrice: parseFloat(amount),
        isPaid: true,
        paymentMethod,
        currency: currency.toUpperCase(),
        ...(couponName !== null && { couponName: couponName })
    };
    logger.info(`Reservation request object: ${JSON.stringify(reservationRequestObj)}`);
    return reservationRequestObj;
}

const createOfflineChargeRequestObj = (obj, reservationId) => {
    const { guestName, listingId, amount, checkInDate, checkOutDate, paymentMethod } = obj;
    const paymentMethodMap = {
        card: 'credit_card',
        us_bank_account: 'bank_transfer',
        affirm: 'other'
    };
    const paymentMethodMapped = paymentMethodMap[paymentMethod] || 'other';

    const requestBody = {
        title: `Booking Payment from ${guestName}`,
        description: `Payment for reservation of listing ${listingId}. Payment for securing the booking from ${checkInDate} to ${checkOutDate}.`,
        amount: parseFloat(amount),
        paymentMethod: paymentMethodMapped,
        status: 'paid',
        scheduledDate: getCurrentDateTime()
    };
    return requestBody;
};

const createOfflineCharge = async (obj, reservationId) => {
    const requestBody = createOfflineChargeRequestObj(obj, reservationId);

    const url = `${HOSTAWAY_API_URL}/guestPayments/charges/${reservationId}`;
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return null;

        const response = await axios.post(url, requestBody, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Cache-Control": "no-cache",
            },
        });

        if (response.statusCode === 200 || response.statusCode === 201) {
            logger.info(`[Hostaway] Offline charge created successfully`);
            logger.info(`[Hostaway] Offline charge object from hostaway: ${JSON.stringify(response.data.result)}`);
        }
        return response.data?.result;
    } catch (error) {
        logger.error(`Error creating offline charge`, error);
        return null;
    }
}

const getCoupon = async (couponCode) => {
    const url = `${HOSTAWAY_API_URL}/coupons?limit=500`;
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return null;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Cache-Control": "no-cache",
            },
        });
        const coupon = response.data?.result.filter(coupon => coupon.name === couponCode);
        return coupon;
    } catch (error) {
        logger.error(`Error fetching coupons`, error);
        return null;
    }
}

const createReservationCouponObject = async (requestBody) => {
    const url = `${HOSTAWAY_API_URL}/reservationCoupons`;
    const body = {
        couponName: requestBody.couponName,
        listingMapId: requestBody.listingId,
        startingDate: requestBody.checkIn,
        endingDate: requestBody.checkOut,
    };

    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return null;

        const response = await axios.post(url, body, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Cache-Control": "no-cache",
            },
        });

        return response.data?.result;
    } catch (error) {
        logger.error(`Error creating reservation coupon object`, error);
        return null;
    }
}

const HostAwayClient = {
    getAccessToken,
    getListings,
    getListingInfo,
    checkAvailability,
    calculatePrice,
    getCalendar,
    getAmenities,
    getCountries,
    getReviews,
    getTopReviews,
    createHostawayReservation,
    createOfflineCharge,
    getCoupon,
    createReservationCouponObject,
};

export default HostAwayClient;