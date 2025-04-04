const Listing = require("../models/listing");
const { cloudinary } = require("../cloudConfig");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const ExpressError = require("../utils/ExpressError");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.newForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const property = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!property) {
    req.flash("Error", "Listing you requested for does'nt exist!");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { property });
};

module.exports.create = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: `${req.body.listing.location}, ${req.body.listing.country}`,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const listing = req.body.listing;
  const newListing = new Listing(listing);
  if (!response.body.features.length) {
    return next(new ExpressError(404, "Location Not Found"));
  }
  newListing.geometry = response.body.features[0].geometry;

  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  // console.log(newListing);
  await newListing.save();
  req.flash("Success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const property = await Listing.findById(id);
  if (!property) {
    req.flash("Error", "Listing you requested for does'nt exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = property.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_300");
  res.render("./listings/edit.ejs", { property, originalImageUrl });
};

module.exports.update = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.body.listing.location) {
    let response = await geocodingClient
      .forwardGeocode({
        query: `${req.body.listing.location}, ${req.body.listing.country}`,
        limit: 1,
      })
      .send();
    if (!response.body.features.length) {
      return next(new ExpressError(404, "Location Not Found"));
    }
    listing.geometry = response.body.features[0].geometry;
    await listing.save();
  }

  if (req.file) {
    // Delete Old file
    if (listing.image && listing.image.filename) {
      try {
        const publicId = `${listing.image.filename.split(".")[0]}`;

        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted image: ${publicId}`);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
      }
    }
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("Success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let property = await Listing.findByIdAndDelete(id);
  console.log(property);

  if (property.image && property.image.filename) {
    try {
      const publicId = `${property.image.filename.split(".")[0]}`;

      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted image: ${publicId}`);
    } catch (err) {
      console.error("Error deleting image from Cloudinary:", err);
    }
  }

  req.flash("Success", "Listing Deleted!");
  res.redirect("/listings");
};
