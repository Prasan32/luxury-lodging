import logger from "../config/winstonLoggerConfig.js";

const asyncHandler = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            logger.error(`{Api:${req.url}, Error:${error.message}, stack:${error.stack} }`);
            return next(error);
        }
    };
};

export default asyncHandler;
