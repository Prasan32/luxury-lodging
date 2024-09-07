import { Router } from "express";
import { saveReview, getReviews, getTopReviews } from "../controllers/review.controller.js";
import { validate, validateQuery } from "../middlewares/validation.js";
import { saveReviewSchema, getReviewsSchema } from "../validationSchema/review.js";
const router = Router();

router.route('/').post(validate(saveReviewSchema), saveReview);

router.route('/getreviews').get(validateQuery(getReviewsSchema), getReviews);

router.route('/gettopreviews').get(getTopReviews);

export default router;