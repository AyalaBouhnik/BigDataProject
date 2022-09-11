const mongoose = require("mongoose");
const fs = require('fs');


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

FlightDelayModel.find({}, function (err, docs) {
   try {

    const Flights = docs.map((flight) => {
        return {

            period: flight.period,
            month: flight.month,
            day: flight.day,
            airline: flight.airline,
            src: flight.src,
            dst: flight.dst,
            distance: flight.distance,
            SrcWeather: flight.SrcWeather,
            DstWeather: flight.DstWeather,
            arrivalDelay: flight.arrivalDelay

        };
    });
const { Parser } = require('json2csv');

const fields = [ 'period',
  'month',
  'day',
  'airline',
  'src',
  'dst',
  'distance',
  'SrcWeather',
  'DstWeather',
  'arrivalDelay'];
const opts = { fields };

try {
  const parser = new Parser(opts);
  const csv = parser.parse(Flights);
  fs.writeFile("flightsDB.csv", csv, "utf-8", function(error) {
    if (error) throw error;
  });
} catch (err) {
  console.error(err);
}

    return new Promise((resolve, reject) => {
        resolve(true);
    });
} catch (error) {
    console.log(error);
}
   
});







module.exports = FlightDelayModel;
