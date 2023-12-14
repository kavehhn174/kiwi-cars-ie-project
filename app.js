require('dotenv')
  .config({ path: './config/.env' });
const globalErrorHandler = require('./controllers/globalErrorHandler');

const carsRouter = require('./routers/cars');
const frontEndRouter = require('./routers/frontend');
const toolsRouter = require('./routers/tools');

const express = require('express');

const bodyParser = require('body-parser');
const { connect } = require('mongoose');

const port = process.env.PORT || 3000;

const app = express();


app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/cars', carsRouter);
app.use('/', frontEndRouter);
app.use('/tools', toolsRouter);

app.listen(port, async () => {
  await connect(process.env.MONGODB_URL);
  console.log(`Server Started On Port ${port} & Connected To DB`);
});

app.use(function (req, res) {
  res.status(404)
    .send('error');
});

app.use(globalErrorHandler);

