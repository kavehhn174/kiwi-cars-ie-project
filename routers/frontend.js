const express = require('express');
const { default: axios } = require('axios');
const router = new express.Router();

router.get(
  '/home', async function (req, res) {
    try {
      const response = await axios.get(`${process.env.API_URL}/cars?limit=24`);
      const cars = response.data.data;

      const latestCarsResponse = await axios.get(`${process.env.API_URL}/cars?limit=5&sort=saledate`);
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

router.get(
  '/edit-car/:id', async function (req, res) {
    try {
      const response = await axios.get(`${process.env.API_URL}/cars/${req.params.id}`);
      const car = response.data.data;
      const template = '/edit-car';
      const pageTitle = 'Edit Car';
      res.render('pages/edit-car', {
        car,
        template,
        pageTitle
      });
    } catch (err) {
      console.log(err);
    }

  }
);

router.get(
  '/create-car', async function (req, res) {
    try {
      const template = '/edit-car';
      const pageTitle = 'Create Car';
      res.render('pages/create-car', {
        template,
        pageTitle
      });
    } catch (err) {
      console.log(err);
    }

  }
);

router.get(
  '/import', async function (req, res) {
    try {
      const template = '/edit-car';
      const pageTitle = 'Import Car CSV';
      res.render('pages/import-csv', {
        template,
        pageTitle
      });
    } catch (err) {
      console.log(err);
    }

  }
);

router.get(
  '/browse', async function (req, res) {

    try {
      const config = {
        method: 'GET',
        url: `${process.env.API_URL}/cars?limit=24`,
        params: req.query
      };
      const response = await axios(config);
      let carSearch = false;
      if (req.query.car_search) {
        carSearch = true;
      }
      const cars = response.data.data;
      const pageNumber = parseInt(req.query.page) || 1;
      const template = '/home';
      const pageTitle = 'Home';
      res.render('pages/browse', {
        pageNumber,
        queries: req.query,
        carSearch,
        cars,
        template,
        pageTitle
      });
    } catch (err) {
      console.log(err);
    }

  }
);


module.exports = router;
