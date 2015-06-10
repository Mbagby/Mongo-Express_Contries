var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/country_dev");
mongoose.set("debug", true);

module.exports.Country = require("./country");
