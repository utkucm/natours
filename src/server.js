const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection is successful!');
  });

/**
 * Initializing the Server
 * @SERVER_INITIALIZING
 */
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(`App mounted on port: ${PORT}!`)
);

process.on('unhandledRejection', (err) => {
  console.log('UNDHANDLED REJECTION!!! 🔥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!!! 🔥 Shutting down...');
  console.log(err.name, err.message);

  process.exit(1);
});
