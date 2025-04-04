const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { newReview, deleteReview } = require("../controllers/review.js");
const router = express.Router({ mergeParams: true });

// Reviews
router.post("/", isLoggedIn, validateReview, wrapAsync(newReview));

// Delete Reviews
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(deleteReview));

module.exports = router;
