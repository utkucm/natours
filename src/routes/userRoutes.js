const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @IMPORTING_ROUTE_HANDLERS
 */
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/userController');

// const {
//   signup,
//   login,
//   forgotPassword,
//   resetPassword,
//   updatePassword,
//   protect,
//   restrictTo,
// } = require('../controllers/authController');

/**
 * Using Route Mounting as it is more capable to imlement SOLID Principles
 * @ROUTE_MOUNTING
 */
router.post('/login', authController.login);
router.post('/signup', authController.signup);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// Protects the following routes
router.use(authController.protect);

router.get('/me', getMe, getUser);
router.patch('/update-my-password', authController.updatePassword);
router.patch('/update-me', updateMe);
router.delete('/delete-me', deleteMe);

// Restricts following routes to all users EXCEPT ADMIN
router.use(authController.restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
