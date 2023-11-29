const express = require('express');
const { default: axios } = require('axios');
const router = new express.Router();

router.get(
  '/home', async function (req, res) {
    try {
      const response = await axios.get(`${process.env.API_URL}/cars?limit=24`);
      const cars = response.data.data;

      const latestCarsResponse = await axios.get(`${process.env.API_URL}/cars?limit=5`);
      const latestCars = latestCarsResponse.data.data;

      const template = '/home';
      const pageTitle = 'Home';
      res.render('layout/index', {
        cars,
        latestCars,
        template,
        pageTitle
      });
    } catch (err) {
      console.log(err);
    }

  }
);


module.exports = router;
