const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // redirectUrl
    req.session.redirectUrl = req.originalUrl;
    req.flash("Error", "You must be logged in to create a listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("Error", "You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  let errMsg = error?.details?.map((el) => el.message)?.join(", ");
  if (error) {
    throw new ExpressError(400, errMsg);
  } else next();
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  let errMsg = error?.details?.map((el) => el.message)?.join(", ");
  if (error) {
    throw new ExpressError(400, errMsg);
  } else next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let rev = await Review.findById(reviewId);
  if (!rev.author._id.equals(res.locals.currUser._id)) {
    req.flash("Error", "You are not the author of this Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
