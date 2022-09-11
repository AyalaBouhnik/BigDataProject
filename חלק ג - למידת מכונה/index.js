const express = require("express");
const cors = require("cors");

const mongoController = require("./controller/mongo.controller");
const bigmlController = require("./controller/bigml.controller");
const kafkaConsumer = require("./model/Kafka");
const FlightsModel = require("./model/FlightDelayModel");

const app = express();

/* Middlewares */
app.use(express.json());
app.use(cors());

/* Routes */
app
  .get("/", (req, res) => res.send("Hello World!"))
  .post("/api/Flights", mongoController.insertFlight)
  .get("/api/Flights", mongoController.getAllFlights)
  .delete("/api/Flights", mongoController.deleteAllFlights)
  .get("/api/buildModel", bigmlController.buildModel)
  .get("/api/modelInfo", bigmlController.getModelInfo)
  .post("/api/predictFlight", bigmlController.predictFlight);

/* Kafka */
kafkaConsumer.on("data", function (message) {
  const Flight = new FlightsModel(JSON.parse(message.value));
  Flight
    .save()
    .then(() => console.log("Inserted to MongoDB:", JSON.stringify(Flight).slice(0, 100)))
    .catch((err) => console.log(err));
});

/* Start server */
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});
