const dotenv = require("dotenv");
const path = require("path");

const root = path.join.bind(this, __dirname);
dotenv.config({ path: root(".env") });

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL,
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  SESSION_SECRET: process.env.MONGO_URL === "secret",
  PER_PAGE: process.env.PER_PAGE === 3,
  DESTINATION: "uploads",
};
