const bigml = require("bigml");
const jsonfile = require("jsonfile");
const MongoClient = require("mongodb").MongoClient;
//require("dotenv").config();

//const client = new MongoClient(process.env.MONGO_DB_URL);
const client = new MongoClient('mongodb+srv://ginton:203965884@cluster0.eg5wvas.mongodb.net/test');
const dbName = "Flights",
    collectionName = "flight1";

const connection = new bigml.BigML();
const source = new bigml.Source();
let modelInfo = {};

const makeJsonFile = async () => {
    try {
        await client.connect();
        const all = await client
            .db(dbName)
            .collection(collectionName)
            .find()
            .limit(1200)
            .toArray();
        client.close();
        const Flights = all.map((flight) => {
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
        await jsonfile.writeFile("./FilghtsDB.json", Flights, { spaces: 2 });
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    } catch (error) {
        console.log(error);
    }
};

/**
 * @description Builds a model from the data in the database
 */
const buildModel = async (req, res) => {
    await makeJsonFile();
    source.create("./FilghtsDB.json", function (error, sourceInfo) {
        if (!error && sourceInfo) {
            var dataset = new bigml.Dataset();
            dataset.create(sourceInfo, function (error, datasetInfo) {
                if (!error && datasetInfo) {
                    var model = new bigml.Model();
                    model.create(datasetInfo, function (error, model) {
                        if (!error && model) {
                            console.log(model);
                            res.status(200).json({
                                message: "Model built",
                                modelInfo: model,
                            });
                            modelInfo = model;
                        } else {
                            res.status(500).send("Error creating model");
                        }
                    });
                } else {
                    res.status(400).send("Error creating dataset");
                }
            });
        } else {
            res.status(400).send("Error creating source");
        }
    });
};

/**
 * @description Predicts the call using the model
 */
const predictFlight = (req, res) => {
    console.log("modelInfo", modelInfo);
    console.log("FlightToPredict", req.body);
    const FlightToPredict = req.body;
    const prediction = new bigml.Prediction();
    prediction.create(
        modelInfo,
        FlightToPredict,
        function (error, predictionInfo) {
            if (!error && predictionInfo) {
                res.status(200).json({
                    message: "Prediction made",
                    predictionInfo: predictionInfo,
                });
                console.log(predictionInfo);
            } else {
                res.status(500).send("Error making prediction");
            }
        }
    );
};

/**
 * @description Gets the model info
 */
const getModelInfo = (req, res) => {
    console.log("gettting model info");
    if (modelInfo.resource) {
        res.status(200).json({
            message: "Model info",
            modelInfo: modelInfo,
        });
    } else {
        res.status(400).send("Model not built");
    }
};

module.exports = {
    buildModel,
    predictFlight,
    getModelInfo,
};
