const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { index, newForm, show, create, edit, update, deleteListing } = require("../controllers/listings.js");
const router = express.Router();
const { storage } = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage });

// router.route("/").get(wrapAsync(index)).post(isLoggedIn, validateListing, wrapAsync(create));
// router.route("/:id").get(wrapAsync(show)).put(isLoggedIn, isOwner, validateListing, wrapAsync(update));

// Index Route
router.get("/", wrapAsync(index));

// New Route
router.get("/new", isLoggedIn, newForm);

// Show Route
router.get("/:id", wrapAsync(show));

// Create Route
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(create));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(edit));

//Update Route
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(update));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteListing));

module.exports = router;
