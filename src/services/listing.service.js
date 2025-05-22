import createHttpError from "http-errors";
import HostAwayClient from "../clients/hostaway.js";
import { Listing, ListingImage, ListingAmenity } from "../models/index.js";
import logger from "../config/winstonLoggerConfig.js";
import sequelize from "../config/database.js";
import { Op } from "sequelize";
import { stateMap } from "../helpers/state.js";

const syncHostAwayListing = async () => {
    const listings = await HostAwayClient.getListings();

    if (!listings) {
        logger.error("Failed to fetch listings from Hostaway API");
        createHttpError(404, "Failed to fetch listings from Hostaway API");
    }

    const existingListings = await Listing.findAll();

    const deletedListings = existingListings.filter(
        (existingListing) => !listings.some((listing) => listing.id === existingListing.id)
    );

    if (deletedListings.length > 0) {
        const deletedListingIds = deletedListings.map((listing) => listing.id);
        await Listing.destroy({ where: { id: deletedListingIds } });
        logger.info(`Deleted ${deletedListingIds.length} orphaned listings from the database`);
    }

    logger.info(`Syncing ${listings.length} listings from Hostaway API`);

    for (const newListingData of listings) {
       
        await sequelize.transaction(async (t) => {
            
            //delete existingListing
            await Listing.destroy({ where: { id: newListingData.id }, transaction: t });

            const newListingObject = createListingObject(newListingData);

            const newListing = await Listing.create(newListingObject, { transaction: t });

            // Process and save listing images
            if (newListingData.listingImages && newListingData.listingImages.length > 0) {
                const imageObjects = newListingData.listingImages.map(image => createListingImageObject(image, newListing.id));
                await ListingImage.bulkCreate(imageObjects, { transaction: t });
            }

            //Process and save listing amenities
            if (newListingData.listingAmenities && newListingData.listingAmenities.length > 0) {
                const amenityObjects = newListingData.listingAmenities.map(amenity => createListingAmenityObject(amenity, newListing.id));
                await ListingAmenity.bulkCreate(amenityObjects, { transaction: t });
            }

            logger.info(`Listing ${newListing.id} and its images, amenities synced successfully`);
        }).catch((error) => {
            logger.error(`Error syncing listing ${newListingData.id}: ${error.message}`);
            throw error;
        });
    }

    logger.info("Listings and their images, amenities synced successfully");
    return;
};

const createListingObject = (data) => {
    return {
        id: data?.id,
        name: data?.name,
        description: data?.description,
        externalListingName: data?.externalListingName,
        address: data?.address,
        personCapacity: data?.personCapacity,
        price: data?.price,
        guestsIncluded: data?.guestsIncluded,
        priceForExtraPerson: data?.priceForExtraPerson,
        currencyCode: data?.currencyCode,
        internalListingName: data?.internalListingName || "",
        country: data?.country || "",
        countryCode: data?.countryCode || "",
        state: data?.state || "",
        city: data?.city || "",
        street: data?.street || "",
        zipCode: data?.zipcode || "",
        lat: data?.lat || 0,
        lng: data?.lng || 0,
        propertyType: data?.bookingcomPropertyRoomName || "",
        checkInTimeStart: data?.checkInTimeStart || 0,
        checkInTimeEnd: data?.checkInTimeEnd || 0,
        checkOutTime: data?.checkOutTime || 0,
        wifiUsername: data?.wifiUsername || "(NO WIFI)",
        wifiPassword: data?.wifiPassword || "(NO PASSWORD)",
        roomType: data?.roomType || "",
        bathroomType: data?.bathroomType || "",
        bedroomsNumber: data?.bedroomsNumber,
        bedsNumber: data?.bedsNumber,
        bathroomsNumber: data?.bathroomsNumber,
        houseRules: data?.houseRules
    };
};

const createListingImageObject = (image, listingId) => {
    return {
        id: image.id,
        listingId,
        caption: image.caption,
        vrboCaption: image.vrboCaption,
        airbnbCaption: image.airbnbCaption,
        url: image.url,
        sortOrder: image.sortOrder,
    };
};

const createListingAmenityObject = (amenity, listingId) => {
    return {
        id: amenity.id,
        listingId: listingId,
        amenityId: amenity.amenityId,
        amenityName: amenity.amenityName,
    };
};


const getListings = async (page, limit, priceOrder) => {
    const searchObj = {};
    
    if (page && limit) {
        searchObj.limit = parseInt(limit);
        searchObj.offset = (parseInt(page) - 1) * parseInt(limit);
    }

    let order = [];
    if (priceOrder) {
        if (priceOrder === 'low-to-high') {
            order = [['price', 'ASC']];
        } else if (priceOrder === 'high-to-low') {
            order = [['price', 'DESC']];
        }
    }

    const listings = await Listing.findAll({
        include: [
            {
                model: ListingImage,
                as: 'images',
                // order: [['sortOrder', 'DESC']]
            }
        ],
        order,
        ...searchObj
    });

    // Sort images by sortOrder within each listing
    listings.forEach(listing => {
        listing.images.sort((a, b) => a.sortOrder - b.sortOrder);
    });

    return listings;
}

const getListingCount = async () => {
    return await Listing.count({
        distinct: true,
        col: 'id'
    });
}

const getListingInfo = async (listingId) => {
    const listing = await Listing.findByPk(listingId,{
        include: [
            {
                model: ListingImage,
                as: 'images'
            },
            {
                model: ListingAmenity,
                as: 'amenities'
            }
        ]
    });

    // Sort images by sortOrder
    listing.images.sort((a, b) => a.sortOrder - b.sortOrder);

    return listing;
}

const processSearchConditions = (address, personCapacity, priceOrder, bedroomsNumber, roomType, minPrice, maxPrice, amenities) => {
    const listingSearchCondition = {
        ...(Array.isArray(address) && address.length > 0 && {
            [Op.or]: address.map(city => ({
                city: { [Op.like]: `%${city}%` }
            }))
        }),
        ...(personCapacity !== "" && { personCapacity: { [Op.gte]: personCapacity } }),
        ...(bedroomsNumber !== "" && { bedroomsNumber: { [Op.gte]: bedroomsNumber } }),
        ...(roomType !== "" && { roomType: { [Op.eq]: roomType } }),
        ...(minPrice !== "" && { price: { [Op.between]: [minPrice, maxPrice] } }),
    };

    const listingAmenitySearchCondition = {
        ...(amenities !== "" && { amenityId: { [Op.in]: amenities } })
    };

    let order = [];
    if (priceOrder) {
        if (priceOrder === 'low-to-high') {
            order = [['price', 'ASC']];
        } else if (priceOrder === 'high-to-low') {
            order = [['price', 'DESC']];
        }
    }

    return { listingSearchCondition, listingAmenitySearchCondition, order };
};

const searchListings = async (requestObj) => {
    const {
        location,
        checkIn,
        checkOut,
        guests,
        priceOrder,
        bedrooms,
        roomType,
        minPrice,
        maxPrice,
        amenities
    } = requestObj;

    const {
        listingSearchCondition,
        listingAmenitySearchCondition,
        order
    } = processSearchConditions(location, guests, priceOrder, bedrooms, roomType, minPrice, maxPrice, amenities);

    const includes = [
        {
            model: ListingImage,
            as: 'images'
        }
    ];
    
    amenities !== "" && includes.push({
        model: ListingAmenity,
        as: 'amenities',
        where: listingAmenitySearchCondition
    });

    const listings = await Listing.findAll(
        {
            where: listingSearchCondition,
            include: includes,
            order
        },
    );

    // Sort images by sortOrder within each listing
    listings.forEach(listing => {
        listing.images.sort((a, b) => a.sortOrder - b.sortOrder);
    });

    if (checkIn != "" && checkOut != "") {
        const accessToken = await HostAwayClient.getAccessToken();
        for (const listing of listings) {
            const isAvailable = await HostAwayClient.checkAvailability(accessToken, listing.id, checkIn, checkOut);
            listing.isAvailable = isAvailable;
        }

        const availableListings = listings.filter(listing => listing.isAvailable);
        return availableListings;
    }

    return listings;
}

const checkAvailability = async (listingId, checkIn, checkOut) => {
    const accessToken = await HostAwayClient.getAccessToken();
    const isAvailable = await HostAwayClient.checkAvailability(accessToken, listingId, checkIn, checkOut);
    return isAvailable;
}

const calculatePrice = async (listingId, checkIn, checkOut, guests, couponName, petCount) => {
    let priceDetails = null;
    if (couponName !== null) {
        priceDetails = calculatePriceWithCouponCode(couponName, listingId, checkIn, checkOut, guests);
    }else{
        priceDetails = await HostAwayClient.calculatePrice(listingId, checkIn, checkOut, guests, couponName);
    }

    if(petCount){
        //Fetch listingInfo and add the petFee
        const listing = await HostAwayClient.getListingInfo(listingId);
        const petFee = listing.airbnbPetFeeAmount;

        if (petFee) {
            priceDetails.components.push({
                id: null,
                name: "petFee",
                title: "Pet fee",
                value: petFee,
                total: petFee
            });
            priceDetails.totalPrice = Number(priceDetails.totalPrice) + Number(petFee);
        }
    }

    return priceDetails;
};

const calculatePriceWithCouponCode = async (couponName, listingId, checkIn, checkOut, guests) => {
    const reservationCoupon = await HostAwayClient.createReservationCouponObject({ couponName, listingId, checkIn, checkOut });
    console.log(reservationCoupon);
    if (!reservationCoupon) {
        throw createHttpError(400, 'Invalid Coupon');
    }

    const reservationCouponId = reservationCoupon.reservationCouponId;
    const priceDetails = await HostAwayClient.calculatePrice(listingId, checkIn, checkOut, guests, reservationCouponId);
    return priceDetails;
}

const filterCoupon = async (couponCode, listingId, checkInDate, checkOutDate) => {
    const coupons = await HostAwayClient.getCoupon(couponCode);
    if (coupons.length === 0) {
        throw createHttpError(400, 'Invalid coupon code');
    }

    const coupon = coupons[0];

    // check if the coupon code is valid for the given listing
    if (!coupon.listingMapIds.includes(listingId)) {
        throw createHttpError(400, 'Coupon code is not valid for this listing');
    }

    // check if the coupon code is expired or inactive
    if (coupon.isExpired === 1 || coupon.isActive === 0) {
        throw createHttpError(400, 'Coupon code is expired or inactive');
    }

    const currentDate = new Date();

    // Check validityDateStart and validityDateEnd
    if (coupon.validityDateStart && coupon.validityDateEnd) {
        const validityStart = new Date(coupon.validityDateStart);
        const validityEnd = new Date(coupon.validityDateEnd);
        if (currentDate < validityStart || currentDate > validityEnd) {
            throw createHttpError(400, 'Coupon code is not valid in the current date range');
        }
    }

    // Check checkInDateStart and checkInDateEnd for the provided check-in date
    if (coupon.checkInDateStart && coupon.checkInDateEnd) {
        const checkInDateStart = new Date(coupon.checkInDateStart);
        const checkInDateEnd = new Date(coupon.checkInDateEnd);
        const providedCheckInDate = new Date(checkInDate);

        if (providedCheckInDate < checkInDateStart || providedCheckInDate > checkInDateEnd) {
            throw createHttpError(400, 'Coupon code is not valid for the given check-in date range');
        }
    }

    // Calculate the length of stay
    const providedCheckInDate = new Date(checkInDate);
    const providedCheckOutDate = new Date(checkOutDate);
    const lengthOfStay = (providedCheckOutDate - providedCheckInDate) / (1000 * 60 * 60 * 24); // in days

    // Check the lengthOfStayCondition
    if (coupon.lengthOfStayCondition === 'equalTo' && lengthOfStay !== coupon.lengthOfStayValue) {
        throw createHttpError(400, `Coupon code requires a stay length of exactly ${coupon.lengthOfStayValue} days.`);
    } else if (coupon.lengthOfStayCondition === 'moreThanOrEqualTo' && lengthOfStay < coupon.lengthOfStayValue) {
        throw createHttpError(400, `Coupon code requires a stay length of at least ${coupon.lengthOfStayValue} days.`);
    } else if (coupon.lengthOfStayCondition !== 'equalTo' && coupon.lengthOfStayCondition !== 'moreThanOrEqualTo') {
        logger.warn(`Unknown lengthOfStayCondition: ${coupon.lengthOfStayCondition}`);
    }

    return coupon;
};

const getDiscountPrice = async (couponCode, listingId, checkInDate, checkOutDate, totalPrice) => {
    const coupon = await filterCoupon(couponCode, listingId, checkInDate, checkOutDate);

    let discountAmount;

    if (coupon.type === 'flatFee') {
        discountAmount = coupon.amount;
    } else if (coupon.type === 'percentage') {
        discountAmount = (totalPrice * (coupon.amount / 100));
    } else {
        throw createHttpError(400, 'Invalid coupon type');
    }

    // Ensure the discounted price doesn't go below zero
    if (discountAmount < 0) {
        discountAmount = 0;
    }

    return discountAmount;
};

const getCalendar = async (listingId, startDate) => {
    const calendar = await HostAwayClient.getCalendar(listingId, startDate);
    const { unAvailableDateForBooking, availableCheckOutDate, availableDate } =await processAvailability(calendar);
    return {
        unAvailableDateForBooking,
        availableDate,
        availableCheckOutDate
    };
};

async function processAvailability(data) {
    const availableDateSet = [];
    const unAvailableDateForBooking = [];
    const availableCheckoutDate = [];

    const arrivalDatesList = [];
    const departureDatesList = [];
    
    // Step 1: Extract reservation-based arrival/departure dates
    data.forEach(entry => {
        if (Array.isArray(entry.reservations)) {
            entry.reservations.forEach(res => {
                if (res?.arrivalDate) arrivalDatesList.push(res.arrivalDate);
                if (res?.departureDate) departureDatesList.push(res.departureDate);
            });
        }
    });

    // Step 1.1: Remove dates that are both arrival and departure
    const duplicateDates = arrivalDatesList.filter(date => departureDatesList.includes(date));
    duplicateDates.forEach(date => {
        unAvailableDateForBooking.push(date);
        arrivalDatesList.splice(arrivalDatesList.indexOf(date), 1);
        departureDatesList.splice(departureDatesList.indexOf(date), 1);
    });

    // Step 2: Create a set of available dates for quick lookup
    const availableDateSetMap = new Set();
    data.forEach(entry => {
        if (entry.isAvailable == 1) {
            availableDateSet.push(entry.date);
            availableDateSetMap.add(entry.date);
        }
    });

    // Step 3: Process unavailable dates
    data.forEach(entry => {
        const { date, isAvailable } = entry;

        if (isAvailable == 0) {
            // If it's a reservation arrival date, allow checkout
            if (arrivalDatesList.includes(date)) {
                availableCheckoutDate.push(date);
                return;
            }

            // Check if previous day is available
            const prevDate = new Date(date);
            prevDate.setDate(prevDate.getDate() - 1);
            const prevDateStr = prevDate.toISOString().split('T')[0];
            
            if (availableDateSetMap.has(prevDateStr)) {
                availableCheckoutDate.push(date);
            } else {
                unAvailableDateForBooking.push(date);
            }
        }
    });

    // Step 4: Remove today if present in availableCheckoutDate
    const today = new Date().toISOString().split('T')[0];
    const todayIndex = availableCheckoutDate.indexOf(today);
    if (todayIndex !== -1) {
        availableCheckoutDate.splice(todayIndex, 1);
        unAvailableDateForBooking.push(today);
    }

    return {
        availableDate: availableDateSet,
        unAvailableDateForBooking,
        availableCheckOutDate: availableCheckoutDate
    };
}




const getAmenities = async () => {
    const amenities = await HostAwayClient.getAmenities();
    return amenities;
}

const getCountries = async () => {
    const countries = await HostAwayClient.getCountries();
    const countryArray = Object.entries(countries).map(([code, country]) => {
        return { country, code };
    });
    return countryArray;
}

const getLocationList = async () => {
    const list = await Listing.findAll({
        attributes: ['country', 'state', 'city', 'lat', 'lng']
    });

    const result = list.reduce((acc, { country, state, city, lat, lng }) => {
        const fullStateName = stateMap[state] || state; // fallback to original if not mapped
        const stateIndex = acc.findIndex(item => item.state === fullStateName);

        if (stateIndex === -1) {
            // If state is not already present, add it
            acc.push({ country, state: fullStateName, cities: [{ city, lat, lng }] });
        } else {
            // If state is present, add the city if not already present
            const cityExists = acc[stateIndex].cities.some(item => item.city === city);
            if (!cityExists) {
                acc[stateIndex].cities.push({ city, lat, lng });
            }
        }
        return acc;
    }, []);

    // Sort states alphabetically
    result.sort((a, b) => a.state.localeCompare(b.state));

    // Sort cities in each state alphabetically
    result.forEach(stateItem => {
        stateItem.cities.sort((a, b) => a.city.localeCompare(b.city));
    });

    return result;
};


const listingService = {
    syncHostAwayListing,
    getListings,
    getListingCount,
    getListingInfo,
    searchListings,
    checkAvailability,
    calculatePrice,
    getCalendar,
    getAmenities,
    getCountries,
    getDiscountPrice,
    getLocationList
};

export default listingService;