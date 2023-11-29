const express = require('express');
const carController = require('../controllers/carController');

const router = new express.Router();

router
  .route('/loadData')
  .post(carController.loadCarDataToDB);

router
  .route('/')
  .get(carController.getAllCars)
  .post(carController.createCar);

router
  .route('/:id')
  .get(carController.getCar)
  .post(carController.updateCar)
  .delete(carController.deleteCar);

module.exports = router;
