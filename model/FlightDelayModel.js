const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://ginton:203965884@cluster0.eg5wvas.mongodb.net/test');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const FlightSchema = new Schema({
  period: String,
  month: String,
  day: String,
  airline: String,
  src: String,
  dst: String,
  distance: String,
  SrcWeather: String,
  DstWeather: String,
  arrivalDelay: String,
});

const FlightDelayModel = mongoose.model('Flights', FlightSchema );

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

module.exports = FlightDelayModel;
