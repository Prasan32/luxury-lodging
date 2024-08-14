import { Router } from "express";
import { createSubscription, processContactSubmission } from "../controllers/contact.controller.js";
import { validate } from "../middlewares/validation.js";
import { createSubscriptionSchema, processContactSubmissionSchema } from "../validationSchema/contact.js";
const router = Router();

router.route('/').post(validate(processContactSubmissionSchema), processContactSubmission);

router.route('/createsubscription').post(validate(createSubscriptionSchema), createSubscription);

export default router;