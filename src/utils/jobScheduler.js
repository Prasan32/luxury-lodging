import schedule from 'node-schedule';
import logger from '../config/winstonLoggerConfig.js';
import listingService from '../services/listing.service.js';
import { getCurrentDateTime } from '../helpers/date.js';

export default function syncHostawayListing() {
    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
    rule.hour = 0;
    rule.minute = 1;

    schedule.scheduleJob(rule, async () => {
        try {
            // syncHostAwayListings()
            logger.info('Executing syncHostAwayListings job...');
            await listingService.syncHostAwayListing();
            logger.info('syncHostAwayListings job executed successfully');
        } catch (error) {
            logger.error('Error executing cron job:', error.message);
        }
    });
}