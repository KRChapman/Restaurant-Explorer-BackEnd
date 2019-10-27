


const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
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

app.post('/api/yelp', (req, res) => {
  // const { city, state, country } = placeDetails;

  // queries.forEach((element, i) => {
  //   let urlMatch = `https://api.yelp.com/v3/businesses/matches?name=${allPlaces[i].name}&address1=${allPlaces[i].address}&city=${city}&state=${state}&country=${country}`;
  //   let request = {
  //     method: 'GET',

  //     headers: { "Authorization": "Bearer gqw4k3JJGYyUVrE5fvmaOBd9YerLDsSJxXtBykLWy3U1226XfsGL4gDIq0ARBRsoiuJGN66bEh0ozpxleHGcC3rB8uncvLSg8r0gVCaw8rYDrBXr3PaSaVF1MNnPW3Yx" }
  //   }
  //   queries[i].yelp = { url: urlMatch, request }
  
  // });

  

// res.send('hiiii');
  ///:address/:city/:state/:country

  // let name = req.query.name.toLowerCase();
  // let location = req.query.location;
  // let city = req.query.city || 'Seattle';
  // let state = req.query.state || 'WA';
  // let country = req.query.country || 'US';
  // console.log('req.query', req.query);
  // let urlMatch = `https://api.yelp.com/v3/businesses/matches?name=${name}&address1=${location}&city=${city}&state=${state}&country=${country}`;
  // //let urlLatLong = 'https://api.yelp.com/v3/autocomplete?text="dance&latitude=47.6062&longitude=-122.3321'
  // let urlSearch = `https://api.yelp.com/v3/businesses/search?term=${name}&location=${city}%20${state}%20${location}&radius=200`
  // let request = {
  //   method: 'get',
  //   url: urlMatch,
  //   headers: { "Authorization": "Bearer gqw4k3JJGYyUVrE5fvmaOBd9YerLDsSJxXtBykLWy3U1226XfsGL4gDIq0ARBRsoiuJGN66bEh0ozpxleHGcC3rB8uncvLSg8r0gVCaw8rYDrBXr3PaSaVF1MNnPW3Yx"}
  // }

  const displayLimit = req.body.displayLimit;
  const iterateApiCalls = (queries, index, yelpData ) => {
  

    if (index < displayLimit) {//NEED TO pass from display limit in LAYOUT COMPONENT!!!
      if (index === 0){
      //  queries[index].phoneNumber = '+15555555'
      }
      var i = index;
      var urlBusinesses = `https://api.yelp.com/v3/businesses/matches?name=${queries[i].name}&address1=${queries[i].address}&city=${queries[i].city}&state=${queries[i].state}&country=${queries[i].country}`;
      var urlPhone = `https://api.yelp.com/v3/businesses/search/phone?phone=${queries[i].phoneNumber}`

      var urlMatch;
      var request = {
        method: 'GET',
        //  url: urlPhone,
        headers: { "Authorization": "Bearer gqw4k3JJGYyUVrE5fvmaOBd9YerLDsSJxXtBykLWy3U1226XfsGL4gDIq0ARBRsoiuJGN66bEh0ozpxleHGcC3rB8uncvLSg8r0gVCaw8rYDrBXr3PaSaVF1MNnPW3Yx" }
      }
    //  const name = queries[index].health.request
      // const healthUrl = queries[index].health.url
      // const yelpRequest = queries[index].yelp.request
      // const yelpthUrl = queries[index].yelp.url
 
      const apiEndpointToFetch = queries[i].phoneNumber != null ? yelpPhone : yelpBusiness;
      console.log("queriesqueries", queries);
      //  debugger;
      apiEndpointToFetch();
      // switch (endpoint) {
      //   case 'phone':
      //     request.url = urlPhone
      //     urlMatch = urlPhone
      //     break;
      //   case 'business':
      //     request.url = urlBusinesses
      //     urlMatch = urlBusinesses
      //     break;
      
      //   default:
      //     break;
      // }


              // Promise.resolve(
              //   apiRequest(urlMatch, request),
          
              // ).then((response) => {
              //   return response.json()
              // })
              //   .then((data) => {
              //     let yelpHealth = {
              //       health: data
                  
              //     }
              //     console.log('yelpHealthyelpHealthyelpHealth', yelpHealth);
              //     yelpData.push(yelpHealth);
              //     index = index + 1;
              //     iterateApiCalls(queries, index, yelpData, "phone")
              //   }).catch(e=>{
              //     console.log('eeee', e);
              //     let yelpHealth = {
              //       health: null

              //     }
              //     index = index + 1;
              //     yelpData.push(yelpHealth);
              //     endpoint = endpoint === "business" ? "phone" : "business";
              //     iterateApiCalls(queries, index, yelpData, endpoint)
              //   })
    }
    else {
    //  console.log('yelpData', yelpData );
      res.send(yelpData);
    }


    function yelpPhone(){
      request.url = urlPhone
      Promise.resolve(
        apiRequest(urlPhone, request),

      ).then((response) => {
        return response.json()
      })
        .then((data) => {
          let yelp = {
            yelp: data

          }

          if (data.businesses.length <= 0){
            yelpBusiness();
          } 
          else{
            index = index + 1;
            yelpData.push(yelp);
           // debugger;
            iterateApiCalls(queries, index, yelpData)
          }
       
        }).catch(e => {
        //  console.log('eeee', e);

          yelpBusiness()
        })


    }

    function yelpBusiness(){
      request.url = urlBusinesses
      Promise.resolve(
        apiRequest(urlBusinesses, request),

      ).then((response) => {
        return response.json()
      })
        .then((data) => {

       
          dataId = data.businesses[0].id
       //queries, index, yelpData
          yelpDetails(dataId)
        }).catch(e => {
        //  console.log('eeee', e);
          let yelp = {
            yelp: null

          }
          index = index + 1;
          yelpData.push(yelp);
     
          iterateApiCalls(queries, index, yelpData)
        })

    }

    function yelpDetails(id){
      const urlDetails = `https://api.yelp.com/v3/businesses/${id}`
     
      request.url = urlDetails
      Promise.resolve(
        apiRequest(urlDetails, request)

      ).then((response) => {
        return response.json()
      })
        .then((data) => {
          let yelp = {
            yelp: data

          }

          yelpData.push(yelp);
          index = index + 1;
          iterateApiCalls(queries, index, yelpData)
        }).catch(e => {
          console.log('eeee', e);
          let yelp = {
            yelp: null

          }

          index = index + 1;
          yelpData.push(yelp);
 
          iterateApiCalls(queries, index, yelpData)
        })
    }

  }

  const yelphData = []
  iterateApiCalls(req.body.data, 0, yelphData);

  async function apiRequest(endpoint, request){
    const response = await fetch(endpoint, {
      ...request,
      //  headers: { ...request.headers, 'Content-Type': 'application/json'}
    });

    if (response.status < 200 || response.status >= 300) {
      const error = new Error(response.statusText);
      error.response = response;
      error.status = response.status;
      throw error;
    }

    return response;
  }



 // "content-type": 'application/json',  47.6062, -122.3321
//Authorization
  
  
});


app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));