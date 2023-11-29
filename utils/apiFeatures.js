const { query } = require('express');

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // NOTE: Find solution to guess ids and convert them to ObjectId

    let queryObj = { ...this.queryString };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne|eq)\b/g,
      (match) => `$${match}`
    );

    queryObj = JSON.parse(queryStr);

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',')
        .join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.limit(limit)
      .skip(skip);

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',')
        .join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  cars() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let orQueryArray = [];

    // if (queryObj['car_search']) {
    //   orQueryArray = [
    //     {
    //       model: new RegExp(queryObj['car_search'], 'i')
    //     },
    //     {
    //       vin: new RegExp(queryObj['car_search'], 'i')
    //     },
    //     {
    //       make: new RegExp(queryObj['car_search'], 'i')
    //     }
    //   ];
    //   delete queryObj['car_search'];
    // }

    if (queryObj['car_search']) {
      orQueryArray = [
        {
          model: queryObj['car_search']
        },
        {
          vin: queryObj['car_search']
        },
        {
          make: queryObj['car_search']
        }
      ];
      delete queryObj['car_search'];
    }

    // if (queryObj.model) {
    //   queryObj.model = new RegExp(queryObj['model'], 'i');
    // }

    if (orQueryArray.length > 0) {
      queryObj['$or'] = orQueryArray;
    }

    this.query = this.query.find(queryObj);
    delete this.query._conditions['car_search'];

    return this;
  }

}

module.exports = APIFeatures;
