const express = require('express');
const router = new express.Router();
const { default: axios } = require('axios');
const converter = require('json-2-csv');
const fs = require('fs');
router
  .route('/export-csv')
  .get(async function (req, res) {
    const config = {
      method: 'GET',
      url: `${process.env.API_URL}/cars`,
      params: req.query
    };
    console.log(config);
    try {
      const response = await axios(config);
      console.log(response);
      const csv = await converter.json2csv(response.data.data);
      await fs.writeFileSync('data.csv', csv);
      res.download('./data.csv');
      // res.send(response);
    } catch (err) {
      console.log(err);
    }
  });

module.exports = router;
