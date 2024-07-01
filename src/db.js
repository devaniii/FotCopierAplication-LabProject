// src/db.js (o donde configures tu conexión a MongoDB)
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fotCopierDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

module.exports = mongoose.connection;
