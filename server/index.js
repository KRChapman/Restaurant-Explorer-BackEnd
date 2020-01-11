const express = require('express');
const bodyParser = require('body-parser');
const { yelpApi} = require('./../api/yelp');
const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
 
  res.send('hi')
 
});

app.post('/api/yelp', async (req, res) => {
  const displayLimit = req.body.displayLimit;
  const yelpData = await yelpApi(req.body.data, displayLimit, res);
 
  res.send(yelpData);
});



app.listen(port, () => console.log(`Listening on port ${port}`));