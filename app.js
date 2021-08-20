const winston = require("winston");
const express = require("express");
const config = require("config");
const app = express();
const memberships = require('./startup/dbConfig');
require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/config")();
require("./experiment/dates");

app.use('/api',  memberships);

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
