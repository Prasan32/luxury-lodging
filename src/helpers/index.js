import redisClient from "../config/redis.js";
import logger from "../config/winstonLoggerConfig.js";

export function generateCacheKey(url) {
    const urlObj = new URL(url, 'http://localhost'); // Base needed for relative URLs

    // Remove leading slash and split path by '/'
    const pathParts = urlObj.pathname.replace(/^\/+/, '').split('/');

    // Join path parts with colon
    let key = pathParts.join(':');

    // Process query parameters if any
    if (urlObj.searchParams && [...urlObj.searchParams].length > 0) {
        // Get entries and sort by key
        const sortedParams = [...urlObj.searchParams.entries()]
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([k, v]) => `${k}=${v}`)
            .join(':');

        key += ':' + sortedParams;
    }

    return `LL:${key}`;
}

export async function getCachedData(cacheKey) {
    try {
        const cachedData = await redisClient.get(cacheKey);
        return cachedData;
    } catch (error) {
        logger.error('Redis GET error:', error);
        return null;
    }
}

export async function setDataInCache(cacheKey, data) {
    try {
        await redisClient.set(cacheKey, JSON.stringify(data));
    } catch (error) {
        logger.error('Redis SET error:', error);
    }
}

export async function setDataInCacheWithExpiration(cacheKey, expiration, data) {
    try {
        await redisClient.setex(cacheKey, expiration, JSON.stringify(data));
    } catch (error) {
        logger.error('Redis SET error:', error);
    }
}

export async function deleteKeysWithPrefix(prefix) {
    try {
        const pattern = `${prefix}*`;
        let cursor = '0';
        const BATCH_SIZE = 500;

        do {
            const [nextCursor, keys] = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
            cursor = nextCursor;

            if (Array.isArray(keys) && keys.length > 0) {
                for (let i = 0; i < keys.length; i += BATCH_SIZE) {
                    const batch = keys.slice(i, i + BATCH_SIZE);
                    if (batch.length > 0) {
                        await redisClient.del(...batch);
                        logger.info(`Deleted ${batch.length} keys with prefix "${prefix}"`);
                    }
                }
            }
        } while (cursor !== '0');
    } catch (error) {
        logger.error('Redis prefix deletion error:', error);
    }
}
