import schedule from 'node-schedule';
import logger from '../config/winstonLoggerConfig.js';
import listingService from '../services/listing.service.js';
import { deleteKeysWithPrefix } from '../helpers/index.js';

async function syncHostawayListing() {
        try {
            // syncHostAwayListings()
            logger.info('Executing syncHostAwayListings job...');
            await listingService.syncHostAwayListing();
            await listingService.getListingPerNightPrice();
            await deleteKeysWithPrefix('LL');
            logger.info('syncHostAwayListings job executed successfully');
        } catch (error) {
            logger.error('Error executing cron job:', error.message);
        }
}

async function getListingPriceFromPricelabs() {
    try {
        logger.info('Executing calculateListingPrice job...');
        await listingService.getListingPriceFromPricelabs();
        logger.info('calculateListingPrice job executed successfully');
    } catch (error) {
        logger.error('Error executing cron job calculateListingPrice:', error.message);
    }
}

export function scheduledJobs() {
    schedule.scheduleJob({ hour: 1, minute: 0, tz: "America/New_York" }, syncHostawayListing);
    // schedule.scheduleJob({ hour: 1, minute: 2, tz: "America/New_York" }, getListingPriceFromPricelabs);
}


