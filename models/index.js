const mongoose = require('mongoose');

const Car = require('./Car');

const connectionString = 'mongodb://127.0.0.1/autoCat';

async function init() {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected');

    mongoose.connection.on('error', (err) => {
      console.error('Database error');
      console.error(err);
    });
  } catch (err) {
    console.error('Error connecting to database');
    console.error(err);
    process.exit(1);
  }
}

module.exports = init;
