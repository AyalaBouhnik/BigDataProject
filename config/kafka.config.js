
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

module.exports = kafkaConf;