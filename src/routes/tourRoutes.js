const express = require('express');

const reviewRouter = require('./reviewRoutes');

const router = express.Router();

/**
 * @IMPORTING_ROUTE_HANDLERS
 */
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require('../controllers/tourController');

const { protect, restrictTo } = require('../controllers/authController');

/**
 * Using Route Mounting as it is more capable to imlement SOLID Principles
 * @ROUTE_MOUNTING
 */
router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(getTourStats);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router.route('/distances/:latlng/unit/:unit').get(getDistances);
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getToursWithin);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

// router.route('/:tourId/reviews').post(protect, restrictTo('user'), createReview);

module.exports = router;
