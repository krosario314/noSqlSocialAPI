const { connect, connection } = require("mongoose");

connect("mongodb://localhost/social-network-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;