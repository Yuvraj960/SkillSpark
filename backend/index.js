// server.js (This is the Entry point of Backend server)
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
require("dotenv").config();

connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
