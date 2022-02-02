const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/autoCat';

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
