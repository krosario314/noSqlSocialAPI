const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network-API', {

  useNewUrlParser: true,
  useUnifiedTopology: true
});


mongoose.set('debug', true);

module.exports = mongoose.connection