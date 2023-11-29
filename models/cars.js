const mongoose = require('mongoose');

const ObjectID = mongoose.Schema.Types.ObjectId;

const carSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      index: true
    },
    make: String,
    model: {
      type: String,
      index: true
    },
    trim: String,
    body: String,
    transmission: String,
    condition: Number,
    odo: Number,
    color: String,
    price: {
      type: Number,
      index: true,
    },
    saleDate: Date,
    vin: String,
    imageNumber: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
