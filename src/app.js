const cookieParser = require('cookie-parser');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Mounts express application
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/**
 * Importing Routes from their Seperate Files
 * @ROUTE_IMPORTS
 */
const bookingRouter = require('./routes/bookingRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

/**
 * @GLOBAL_MIDDLEWARES
 */
// Setting Up Static File Server
app.use(express.static(path.join(__dirname, 'public')));

// Setting Up Security Headers
app.use(helmet());

// Logger Middleware for Development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limiting Request from a same IP for a Given Period of Time
const limiter = rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Data Sanitization against NoSQL Query Injection Attacks
app.use(mongoSanitize());

// Data Sanitization against XSS Attacks
app.use(xss());

// Preventin Http Paramater Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Body Parser & Limiting Request Data
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

/**
 * Mounting Routers
 * @ROUTES
 */
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
