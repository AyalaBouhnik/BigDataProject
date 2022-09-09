const uuid = require("uuid");
const { KafkaConsumer } = require("node-rdkafka");

const kafkaConf = require("../config/kafka.config");


const consumer = new KafkaConsumer(kafkaConf);

consumer
    .on("ready", (arg) => {
        const topic = 'r32sn9cb-default';
        consumer.subscribe([topic]);
        console.log(`Consumer ${arg.name} ready. topics: ${topic}`);
        consumer.consume();
    })
    .on("disconnected", (arg) => {
      console.log(`Consumer ${arg.name} disconnected.`);
      consumer.connect();
    })
    .on("event.error", (err) => {
        console.log(`Error from consumer: ${err}`);
        consumer.disconnect();
    })
    .connect();

module.exports = consumer;
