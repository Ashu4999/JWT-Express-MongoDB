const cron = require("node-cron");
const axios = require("axios");

const APP_URL = process.env.APP_URL;
const API_URL = process.env.API_URL;

const startCronJobs = () => {
  try {
    // Schedule the cron job
    cron.schedule("0 0 * * *", async () => {
      // Every 5 minutes
      try {
        await axios.get(APP_URL);
        console.log(
          "Frontend Ping successful",
          APP_URL,
          new Date().toLocaleString()
        );
      } catch (Exception) {
        console.error("Error pinging frontend", Exception.message);
      }

      try {
        await axios.get(API_URL);
        console.log(
          "Backend Ping successful",
          API_URL,
          new Date().toLocaleString()
        );
      } catch (Exception) {
        console.error("Error pinging backend", Exception.message);
      }
    });
  } catch (Exception) {
    console.error("Error scheduling cron job", Exception);
  }
};

module.exports = startCronJobs;
