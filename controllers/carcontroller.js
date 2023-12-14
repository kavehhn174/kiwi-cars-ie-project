const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Car = require('../models/cars');
const ErrorLocalization = require('../utils/ErrorManager/error');
const errorLocalization = new ErrorLocalization(process.env.ERROR_LANGUAGE);
const cliProgress = require('cli-progress');
const APIFeatures = require('../utils/apiFeatures');
const fs = require('fs');

const getAllCars = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Car.find(),
    req.query
  )
    .filter()
    .cars()
    .sort()
    .limitFields()
    .paginate();

  const cars = await features.query;

  res.status(200)
    .json({
      status: 'success',
      data: cars,
    });
});

const createCar = catchAsync(async (req, res, next) => {
  const car = await Car.create(req.body);

  res.status(201)
    .json({
      status: 'success',
      data: car,
    });
});

const getCar = catchAsync(async (req, res, next) => {
  // await brandExtractor();

  const car = await Car.findById(req.params.id);

  if (!car) {
    return next(new AppError('No promo code found with that ID', 404));
  }

  res.status(200)
    .json({
      status: 'success',
      data: car,
    });
});

const updateCar = catchAsync(async (req, res, next) => {
  const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!car) {
    return next(
      new AppError(
        errorLocalization.getErrorText('NoCarFoundWithThatID'),
        404
      )
    );
  }

  res.status(200)
    .json({
      status: 'success',
      data: car,
    });
});

const deleteCar = catchAsync(async (req, res, next) => {
  const car = await Car.findByIdAndUpdate(req.params.id, {
    isTrash: true,
  });

  if (!car) {
    return next(
      new AppError(
        '',
        404
      )
    );
  }

  res.status(204)
    .json({
      status: 'success',
      data: null,
    });
});

const exportCSV = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Car.find(),
    req.query
  )
    .filter()
    .cars()
    .sort()
    .limitFields()
    .paginate();

  const cars = await features.query;

  res.status(200)
    .json({
      status: 'success',
      data: cars,
    });
});

const loadCarDataToDB = catchAsync(async (req, res, next) => {

  const csvFilePath = './car_prices.csv';
  const csv = require('csvtojson');
  console.log('Loading CSV To Json ...');

  // const csvBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  // csvBar.start(100, 0);


  const jsonArray = await csv()
    .fromFile(csvFilePath);

  const dbBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  const loop_len = jsonArray.length;
  const startTime = new Date();

  await Car.deleteMany();
  dbBar.start(jsonArray.length, 0);
  for (let i = 0; i < jsonArray.length; i++) {
    let tempJson;
    // progressBar.progressBar(i, loop_len, startTime);
    try {
      tempJson = {
        year: parseInt(jsonArray[i].year),
        make: jsonArray[i].make,
        model: jsonArray[i].model,
        trim: jsonArray[i].trim,
        body: jsonArray[i].body,
        transmission: jsonArray[i].transmission,
        condition: parseFloat(jsonArray[i].condition),
        odo: parseInt(jsonArray[i]['odometer']),
        color: jsonArray[i].color,
        price: parseInt(jsonArray[i].price),
        saleDate: jsonArray[i]['saledate'],
        vin: jsonArray[i].vin,
        imageNumber: `${generateRandom()}`
      };

      if (!isNumber(tempJson.condition)) {
        tempJson.condition = 0;
      }
      if (!isNumber(tempJson.odo)) {
        tempJson.odo = 0;
      }
      if (!isNumber(tempJson.year)) {
        tempJson.year = 0;
      }
      if (!isNumber(tempJson.price)) {
        tempJson.price = 0;
      }

      await Car.create(tempJson);
      dbBar.increment();
    } catch (err) {
      dbBar.stop();
      console.log(tempJson[i]);
      console.log(err);
      return res.status(200)
        .json({
          status: 'success',
          error: err,
        });
    }

  }


  return res.status(200)
    .json({
      status: 'success',
      data: null,
    });
});

function isNumber(value) {
  return value && typeof value === 'number';

}

function generateRandom() {
  const max = 1;
  const min = 20;
  // eslint-disable-next-line no-mixed-operators
  const result = Math.random() * (max - min) + min;
  return Math.floor(result);
}

async function brandExtractor() {
  const uniqueBrands = [];

  const cars = await Car.find();
  for (let i = 0; i < cars.length; i++) {
    const brand = cars[i].make;

    // Check if the brand is not already in uniqueBrands array
    if (!uniqueBrands.includes(brand)) {
      uniqueBrands.push(brand);
    }
  }


  // Convert uniqueBrands array to JSON
  const brandsJSON = JSON.stringify(uniqueBrands, null, 2);

  // Write to brands.json file
  fs.writeFileSync('brands.json', brandsJSON);

  console.log('brands.json file created with unique brands.');

}

module.exports = {
  getAllCars,
  createCar,
  deleteCar,
  updateCar,
  exportCSV,
  getCar,
  loadCarDataToDB,
  brandExtractor,
};
