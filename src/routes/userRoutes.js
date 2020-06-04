const express = require('express');

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
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../controllers/userController');

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = require('../controllers/authController');

/**
 * Using Route Mounting as it is more capable to imlement SOLID Principles
 * @ROUTE_MOUNTING
 */
router.post('/login', login);
router.get('/logout', logout);
router.post('/signup', signup);

router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Protects the following routes
router.use(protect);

router.get('/me', getMe, getUser);
router.patch('/update-my-password', updatePassword);
router.patch('/update-me', uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/delete-me', deleteMe);

// Restricts following routes to all users EXCEPT ADMIN
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
