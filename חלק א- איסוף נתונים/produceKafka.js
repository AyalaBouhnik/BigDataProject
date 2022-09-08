// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");

// use you own parameters
const kafkaConf = {
  "group.id": "BigData",
  "metadata.broker.list": "dory-01.srvs.cloudkafka.com:9094,dory-02.srvs.cloudkafka.com:9094,dory-03.srvs.cloudkafka.com:9094".split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": "lr41mmgb",
  "sasl.password": "ClzJ8U-MZ1Q-5AjbEt7Fi36dVwxwbNJT",
  "debug": "generic,broker,security"
};

const prefix = "r32sn9cb-";
const topic = `${prefix}new`;

const prefix2 = "r32sn9cb-";
const topic2 = `${prefix2}default`;

const producer = new Kafka.Producer(kafkaConf);

const genMessage = m => new Buffer.alloc(m.length,m);

producer.on("ready", function(arg) {
  console.log(`producer ${arg.name} ready.`); 
});
producer.connect();

module.exports.publish = function(msg)
{   
  m=JSON.stringify(msg);
  producer.produce(topic, -1, genMessage(m), uuid.v4());   
  producer.produce(topic2, -1, genMessage(m), uuid.v4());  
}