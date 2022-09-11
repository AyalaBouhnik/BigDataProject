const bigml = require("bigml");
const jsonfile = require("jsonfile");

var connection = new bigml.BigML('ginton','eda73f280464f33dd8f323997f637926912e6e36');
var source = new bigml.Source(connection);
let modelInfo = {};


/**
 * @description Builds a model from the data in the database
 */
const buildModel = async (req, res) => {

source.get('source/631485598f679a2d43001335', function (error, sourceInfo) {
//source.create("PartC-MongoBigml\flightsDB1.csv", function (error, sourceInfo) {
        if (!error && sourceInfo) {
            var dataset = new bigml.Dataset(connection);
            dataset.create(sourceInfo, function (error, datasetInfo) {
                
                if (!error && datasetInfo) {
                    
                    var model = new bigml.Model(connection);
                    model.create(datasetInfo, function (error, model) {
                        if (!error && model) {
                            console.log("Model built..\n");
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
    console.log("FlightToPredict", req.body);
    const FlightToPredict = req.body;
    const prediction = new bigml.Prediction(connection);
    prediction.create(
        modelInfo,
        req.body,
        function (error, predictionInfo) {
            if (!error && predictionInfo) {
                console.log("Prediction made..\n");
                console.log("DelayPridict:" , predictionInfo.object.output)
                console.log("prob:" , predictionInfo.object.confidence)
                res.status(200).json({
                    message: "Prediction made",
                    predictionInfo: predictionInfo,
                });
                //console.log(predictionInfo);
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
