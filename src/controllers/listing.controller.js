import listingService from "../services/listing.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import redisClient from "../config/redis.js";
import { deleteKeysWithPrefix, generateCacheKey, getCachedData, setDataInCache } from "../helpers/index.js";
import logger from "../config/winstonLoggerConfig.js";

export const syncHostAwayListing = asyncHandler(async (req, res, next) => {
    await listingService.syncHostAwayListing();
    await deleteKeysWithPrefix('LL')
    return res.status(200).json({ message: "Listings synced successfully" });
})

export const getListings = asyncHandler(async (req, res, next) => {
    const cacheKey = generateCacheKey(req.originalUrl);

    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }

    const { limit, page, priceOrder } = req.query;
    const listings = await listingService.getListings(page, limit, priceOrder);
    await setDataInCache(cacheKey, listings);

    return res.status(200).json(listings);
});

export const getListingCount = asyncHandler(async (req, res, next) => {
    const cacheKey = generateCacheKey(req.originalUrl);

    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }

    const count = await listingService.getListingCount();
    await setDataInCache(cacheKey, { count });

    return res.status(200).json({ count });
});

export const getListingInfo = asyncHandler(async (req, res, next) => {
    const cacheKey = generateCacheKey(req.originalUrl);

    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }

    const listingId = req.params.listingId;
    const listing = await listingService.getListingInfo(listingId);

    if (!listing) {
        return res.status(404).json({ message: `Listing with id ${listingId} not found` });
    }

    await setDataInCache(cacheKey, listing);

    return res.status(200).json(listing);
});

export const searchListings = asyncHandler(async (req, res, next) => {
    const cacheKey = generateCacheKey(req.originalUrl);

    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }

    const listings = await listingService.searchListings(req.body);
    await setDataInCache(cacheKey, listings);

    return res.status(200).json(listings);
});

export const checkAvailability = asyncHandler(async (req, res, next) => {
    const { listingId, checkIn, checkOut } = req.query;
    const isAvailable = await listingService.checkAvailability(listingId, checkIn, checkOut);
    return res.status(200).json({ isAvailable });
});

export const calculatePrice = asyncHandler(async (req, res, next) => {
    const { listingId, checkIn, checkOut, guests, couponName, pet } = req.body;
    const priceDetails = await listingService.calculatePrice(listingId, checkIn, checkOut, guests, couponName, pet);
    return res.status(200).json(priceDetails);
});

export const getCalendar = asyncHandler(async (req, res, next) => {
    const { listingId } = req.params;
    const { startDate } = req.query;
    const calendar = await listingService.getCalendar(listingId, startDate);
    return res.status(200).json(calendar);
});

export const getAmenities = asyncHandler(async (req, res, next) => {
    const cacheKey = generateCacheKey(req.originalUrl);

    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }

    const amenities = await listingService.getAmenities();
    await setDataInCache(cacheKey, amenities);

    return res.status(200).json(amenities);
});

export const getCountries = asyncHandler(async (req, res, next) => {
    const cacheKey = generateCacheKey(req.originalUrl);

    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }

    const countries = await listingService.getCountries();
    await setDataInCache(cacheKey, countries);

    return res.status(200).json(countries);
});

export const getDiscountPrice = asyncHandler(async (req, res, next) => {
    const { couponCode, listingId, checkInDate, checkOutDate, totalPrice } = req.query;
    const discountedPrice = await listingService.getDiscountPrice(couponCode, listingId, checkInDate, checkOutDate, totalPrice);
    return res.status(200).json({ discountedPrice });
});

export const getLocationList = asyncHandler(async (req, res, next) => {
    const cacheKey = generateCacheKey(req.originalUrl);

    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }

    const locationList = await listingService.getLocationList();
    await setDataInCache(cacheKey, locationList);

    return res.status(200).json(locationList);
});