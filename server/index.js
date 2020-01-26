const express = require('express');
const bodyParser = require('body-parser');
const { yelpApi, healthApi} = require('../api');
const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT || 5000;

app.post('/api', async (req, res) => {
  const displayLimit = req.body.displayLimit;
  const yelpData = await yelpApi(req.body.yelp.data, displayLimit);
  const healthData = await healthApi(req.body.health,displayLimit);
  res.send({ yelpData, healthData});
});

app.listen(port, () => console.log(`Listening on port ${port}`));