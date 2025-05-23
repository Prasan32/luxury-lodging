## DATABASE
---------------------------------------------------------------------------------------------------------
1. While creating the database use the following command which will ensure that the database and 
   its tables are fully compatible with the utf8mb4 character set, which supports a wide range of 
   Unicode characters, including emojis and other special symbols.

   CREATE DATABASE db_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

2. Copy the CREATE SCHEMAs from the initialDbSchema.sql file present in the root directory 
3. Run the CREATE SCHEMAs command in the database.
---------------------------------------------------------------------------------------------------------


## ENVIRONMENT VARIABLES
---------------------------------------------------------------------------------------------------------
(You may find the environment variables used in this application inside .env.example file)

Create a .env file in the root directory of the application and provide the environment variables
         OR
You may export the environment variables directly from the console
---------------------------------------------------------------------------------------------------------


## Log
---------------------------------------------------------------------------------------------------------
1. When NODE_ENV is set to 'development', the application will log in the console.

2. WHEN NODE_ENV is set to 'production', the application will log in the .log file.
   Each day a new log file will be created and it would have the name as following
         application-{currentDate}.log
   For example, application-2024-08-08.log

NOTE: The application keeps only the last seven days' worth of log files. 
      Older files are automatically  deleted.
----------------------------------------------------------------------------------------------------------


## STRIPE
---------------------------------------------------------------------------------------------------------
The environment variables STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY should be updated with the keys 
provided by the stripe dashboard respectively.

The webhook that needs to be registered in the stripe for listening to the payment events is 
                         /payment/handlewebhookresponses

Provide the complete url for the webhook. 

This needs to be done after the backend application is deployed and we have the base url of 
the backend application.
So the complete URL would look like:
                        {baseUrl}/payment/handlewebhookresponses

After registering the webhook from the stripe dashboard, a webhook secret would be provided 
by stripe which will start from whsec_
Update the environment variable STRIPE_WEBHOOK_SECRET_KEY with the webhook secret key
----------------------------------------------------------------------------------------------------------


## SENDGRID
---------------------------------------------------------------------------------------------------------
Update the environment variable SENDGRID_API_KEY with the API key provided by sendgrid.

The environment variable EMAIL_FROM should be provided with the email address that is registered 
in the sendgrid.

The enviroment variable EMAIL_TO should be provided with the email address where you want the email to be 
sent when any user submits the contact form from the application.
----------------------------------------------------------------------------------------------------------


## WHITELIST REQUEST URLs
---------------------------------------------------------------------------------------------------------
For NODE_ENV other than development, you need to whitelist the request URLs.

Update the environment variable CORS_WHITELIST with the base URL of the frontend
For example: If the frontend URL is http://localhost:5174 then 
             CORS_WHITELIST=http://localhost:5174

If you want to add more than one whitelist URL then you can specify multiple URLs separated by commas.
For example: If you want to add http://localhost:5173 and http://localhost:5174 then
             CORS_WHITELIST=http://localhost:5173,http://localhost:5174

NOTE: Don't use space after the comma else it will not whitelist the later url after the comma.
---------------------------------------------------------------------------------------------------------
