## DATABASE
---------------------------------------------------------------------------------------------------------
1. Copy the CREATE SCHEMAs from the initialDbSchema.sql file present in the root directory 
2. Run the CREATE SCHEMAs command in the database.
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
