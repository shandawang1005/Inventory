const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "sales-service",
    brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "sales-group" });

const consumeSalesUpdates = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "sales-updates", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            console.log("📥 New Sale Update:", message.value.toString());
            // ✅ 这里可以触发 WebSocket 通知前端
        },
    });
};

module.exports = consumeSalesUpdates;
