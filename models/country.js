var mongoose = require("mongoose");
mongoose.set("debug", true);

var countrySchema = new mongoose.Schema({
	name: String,
	flag: String,
	capital: String,
	population: Number
});

var Country = mongoose.model("Country", countrySchema);
module.exports = Country;

