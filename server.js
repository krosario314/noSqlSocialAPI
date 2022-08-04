const express = require('express');
const db = require('./assets/connection')

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('./routes'));

db.once('open', function() {
  app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
})