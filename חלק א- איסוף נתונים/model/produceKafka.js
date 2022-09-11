// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const { KafkaProducer } = require("node-rdkafka");
const kafkaConf = require("../config/kafka.config");

const producer = new KafkaProducer(kafkaConf);

producer
    .on("ready", (arg) => {
        const topic = 'r32sn9cb-default';
        producer.subscribe([topic]);
        console.log(`producer ${arg.name} ready. topics: ${topic}`);
        producer.produce();
    })
    .on("disconnected", (arg) => {
      console.log(`producer ${arg.name} disconnected.`);
      producer.connect();
    })
    .on("event.error", (err) => {
        console.log(`Error from producer: ${err}`);
        producer.disconnect();
    })
    .connect();

module.exports = producer;