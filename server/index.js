const express = require('express');
const bodyParser = require('body-parser');
const { yelpApi, healthApi, yelpReviewApi} = require('../api');
const dotenv = require('dotenv');
var path = require('path');
const app = express();

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, `./../.env.development.local`) });
}

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

  // NEED TRY CATCH
  let yelpData= [];
  let healthData = [];
  try {
    yelpData  = await yelpApi(req.body.yelp.data, displayLimit);
  } catch (error) {
    console.log(error)
  }

  try {
    healthData  = await healthApi(req.body.health, displayLimit);
  } catch (error) {
    console.log(error)
  }
  
  
  res.send({ yelpData, healthData});
});



app.post('/api/yelp-review', async (req, res) => {
  const yelpId = req.body.yelpId
  try {
    var yelpData = await yelpReviewApi(yelpId);
  } catch (error) {
    console.log(error);
  }
 
 
  res.send({ yelpData});
});

app.listen(port, () => console.log(`Listening on port ${port}`));