const mongoose = require('mongoose');
const slugify = require('slugify');

// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name!'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name cannot be longer than 40 characters!'],
      minlength: [10, 'A tour name cannot be shorter than 10 characters!'],
      //validate: [ validator.isAlpha, 'Tour name must contain only alphanumeric characters!', ],
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration!'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour mush have a group size!'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty level!'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult!',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1!'],
      max: [5, 'Rating must be at most 5!'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price!'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Price discount ({VALUE}) should be below price!',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a tour summary!'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image!'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// Regular function in use bcs there is 'this' keyword needed
tourSchema.virtual('durationWeeks').get(function () {
  if (this.duration / 7 < 1) {
    return `${this.duration} days.`;
  }
  if (this.duration / 7 >= 1) {
    const durationWeeks = Math.floor(this.duration / 7);
    if (durationWeeks === 1) {
      return `${durationWeeks} week.`;
    }
    if (durationWeeks > 1) {
      return `${durationWeeks} weeks.`;
    }
  }
});

// Virtual Populating Reviews from it's own Model
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

/**
 * @DOCUMENT_MIDDLEWARE
 */
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/**
 * @EMBEEDING
 * @But_Implementing_Referencing
tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);

  next();
});
 */

/**
 * @QUERY_MIDDLEWARE
 */
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${(Date.now() - this.start) / 1000} seconds 🔥`);
  next();
});

/**
 * @AGGREGATION_MIDDLEWARE
 */

tourSchema.pre('aggregate', function (next) {
  //check firstInPipeline
  const firstInPipeline = this.pipeline()[0];
  // eslint-disable-next-line no-prototype-builtins
  if (firstInPipeline.hasOwnProperty('$geoNear')) {
    //don't match secret tours, but splice "$match" stage after $geoNear in pipeline
    this.pipeline().splice(1, 0, {
      $match: { secretTour: { $ne: true } },
    });
    return next();
  }

  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});

/*
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
});
*/

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
