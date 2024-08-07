import app from "./src/app.js";
import sequelize from "./src/config/database.js";
import { config } from "./src/config/envConfig.js";
import logger from "./src/config/winstonLoggerConfig.js";

function server() {
    sequelize.authenticate()
        .then(() => {
            logger.info("Database connection has been established successfully.");

            app.listen(config.PORT, (error, server) => {
                if (error) throw error;
                logger.info(`NODE_ENV: ${config.NODE_ENV}`);
                logger.info(`Database Host: ${config.DATABASE_HOST}`);
                logger.info(`Database Name: ${config.DATABASE_NAME}`);
                logger.info(`Server is running on port ${config.PORT}`);
            });
        }).catch(() => {
            logger.error("Unable to connect to the database.");
            process.exit(1);
        });
}

server();