const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "sales-service",
    brokers: ["localhost:9092"], // ✅ Kafka 服务器地址
});

const producer = kafka.producer();

const sendSalesUpdate = async (sale) => {
    await producer.connect();
    await producer.send({
        topic: "sales-updates",
        messages: [{ value: JSON.stringify(sale) }],
    });
    console.log("✅ Sale event sent to Kafka:", sale);
    await producer.disconnect();
};

module.exports = sendSalesUpdate;
