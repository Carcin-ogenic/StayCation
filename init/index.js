const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/staycation";
async function main() {
  mongoose.connect(MONGO_URL);
}

main()
  .then((res) => {
    console.log("Connected To DB");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "67eb547e8f1415d4c5a80797" }));
  await Listing.insertMany(initData.data);
  console.log("Data was Inititalised.");
};

initDB();
