import app from "./src/app.js";
import { config } from "./src/config/config.js";

app.listen(config.PORT, (error, server) => {
    if (error) throw error;
    console.log(`Server is running on port ${config.PORT}`);
});
