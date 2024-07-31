import { Router } from "express";
import { processContactSubmission } from "../controllers/contact.controller.js";
import { validate } from "../middlewares/validation.js";
import { processContactSubmissionSchema } from "../validationSchema/contact.js";
const router = Router();

router.route('/').post(validate(processContactSubmissionSchema), processContactSubmission);

export default router;