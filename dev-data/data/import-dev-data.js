const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../src/models/tourModel');
const User = require('../../src/models/userModel');
const Review = require('../../src/models/reviewModel');

dotenv.config({ path: `${__dirname}/../../src/.env` });

/**
 * @SETTING_UP_AND_CONNECTING_DATABASE
 */
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection is successful!');
  })
  .catch((err) => {
    console.log(err);
  });

/**
 * @READING_JSON_DATA
 */
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

/**
 * @IMPORTING_DATA_TO_DATABASE
 */
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Dev Data Succesfully Imported Into Database 🔥');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

/**
 * @DELETING_ALL_DATA_FROM_DATABASE
 */

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Dev Data Succesfully Deleted Irom Database 🔥');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
