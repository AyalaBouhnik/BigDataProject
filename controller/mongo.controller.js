const MongoClient = require("mongodb").MongoClient;
//require("dotenv").config();

const client = new MongoClient('mongodb+srv://ginton:203965884@cluster0.eg5wvas.mongodb.net/test');
//const client = new MongoClient(process.env.MONGO_DB_URL);


const dbName = "Flights", collectionName = "flight1";

/**
 * @description Inserts a new Flight to the database
 */
const insertFlight = async (req, res) => {
    const data = req.body;
    try {
        await client.connect();
        await client.db(dbName).collection(collectionName).insertOne(data);
        res.json({
            message: "Inserted",
        });
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
};

/**
 * @description Returns all calls from the database
 */
const getAllFlights = async (req, res) => {
    try {
        await client.connect();
        const all = await client
            .db(dbName)
            .collection(collectionName)
            .find()
            .toArray();
        res.json(all);
        client.close();
    } catch (error) {
        console.log(error);
    }
};

/**
 * @description Deletes all calls from the database
 */
const deleteAllFlights = async (req, res) => {
    try {
        await client.connect();
        await client.db(dbName).collection(collectionName).deleteMany({});
        res.json({
            message: "All documents deleted",
        });
        client.close();
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    insertFlight,
    getAllFlights,
    deleteAllFlights,
};
