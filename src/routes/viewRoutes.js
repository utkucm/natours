const express = require('express');

const { isLoggedIn, protect } = require('../controllers/authController');
const {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getAccount,
  updateUserData,
  getMyTours,
} = require('../controllers/viewsController');

const router = express.Router();

router.get(
  '/',
  // createBookingCheckout,
  isLoggedIn,
  getOverview
);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/signup', isLoggedIn, getSignupForm);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);

router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
