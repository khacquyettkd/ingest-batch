const consumer = require( "../services/consumer.service");
const { INTERVAL } = require( "../config/app.config");

setInterval(async () => {
  try {
    await consumer();
  } catch (err) {
    console.error("Consumer error:", err);
  }
}, INTERVAL);
