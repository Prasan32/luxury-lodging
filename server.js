import app from "./src/app.js";
import { config } from "./src/config/envConfig.js";
import logger from "./src/config/winstonLoggerConfig.js";

app.listen(config.PORT, (error, server) => {
    if (error) throw error;
    logger.info(`NODE_ENV: ${config.NODE_ENV}`);
    logger.info(`Server is running on port ${config.PORT}`);
});
