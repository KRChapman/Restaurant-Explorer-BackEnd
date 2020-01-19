const fetch = require('node-fetch');

const yelpApi =  function  (queries, displayLimit){
  const yelpData = [];
  let index = 0;

  return new Promise(function (resolve, reject) {
    iterateApiCalls(queries, index, yelpData);
    function iterateApiCalls(queries, i, yelpData)  {
     
      // SAME PHONE NUMBER ONE IS CLOSED !!!
      // maybe iterate find not closed one then maybe algo that finds closes name based on query
      // yelp:
      // businesses: Array(2)
      // 0: { id: "SQKRGzDa7qd8qHb13Z2-Hg", alias: "delinomore-seattle", name: "DeliNoMore", image_url: "https://s3-media0.fl.yelpcdn.com/bphoto/H1p6njRYuEULDluuwEbiNw/o.jpg", is_closed: false, … }
      // 1: { id: "rkiqLiA9mvM-5ULFxx6TUg", alias: "nickos-seattle", name: "Nicko's", image_url: "https://s3-media0.fl.yelpcdn.com/bphoto/VXmkdiYR_zmdBDwVB3F7Gg/o.jpg", is_closed: true, … }

      if (i < displayLimit) {
        const { placeId } = queries[i];
        var urlBusinesses = `https://api.yelp.com/v3/businesses/matches?name=${queries[i].name}&address1=${queries[i].address}&city=${queries[i].city}&state=${queries[i].state}&country=${queries[i].country}`;
        var urlPhone = `https://api.yelp.com/v3/businesses/search/phone?phone=${queries[i].phoneNumber}`;
        var request = {
          method: 'GET',
          headers: { "Authorization": "Bearer gqw4k3JJGYyUVrE5fvmaOBd9YerLDsSJxXtBykLWy3U1226XfsGL4gDIq0ARBRsoiuJGN66bEh0ozpxleHGcC3rB8uncvLSg8r0gVCaw8rYDrBXr3PaSaVF1MNnPW3Yx" }
        }
        const apiEndpointToFetch = queries[i].phoneNumber != null ? yelpPhone : yelpBusiness;
        apiEndpointToFetch(placeId);
      }
      else {
        resolve(yelpData)
      }

      function yelpPhone(placeId) {
        request.url = urlPhone
        Promise.resolve(
          apiRequest(urlPhone, request),
        ).then((response) => {
         let jsons = response.json()
          return jsons;
        })
          .then((data) => {
            let yelp = {
              placeId,
              yelp: data
            }
            if (data.businesses.length <= 0) {
              yelpBusiness(placeId);
            }
            else {
              index = index + 1;
              yelpData.push(yelp);
              iterateApiCalls(queries, index, yelpData)
            }
          }).catch(e => {
            //console.log('yelpPhone', e);
            yelpBusiness(placeId)
          })
      }

      function yelpBusiness(placeId) {
        request.url = urlBusinesses
        Promise.resolve(
          apiRequest(urlBusinesses, request)
        ).then((response) => {
          return response.json()
        })
          .then((data) => {
            dataId = data.businesses[0].id
            yelpDetails(dataId, placeId )
          }).catch(e => {
           // console.log('yelpBusiness', e);
            let yelp = {
              yelp: null
            }
            index = index + 1;
            yelpData.push(yelp);
            iterateApiCalls(queries, index, yelpData)
          })
      }

      function yelpDetails(id, placeId ) {
        const urlDetails = `https://api.yelp.com/v3/businesses/${id}`

        request.url = urlDetails
        Promise.resolve(
          apiRequest(urlDetails, request)
        ).then((response) => {
          return response.json()
        })
          .then((data) => {
            let yelp = {
              placeId,
              yelp: data
            }
            yelpData.push(yelp);
            index = index + 1;
            iterateApiCalls(queries, index, yelpData)
          }).catch(e => {
            //console.log('yelpDetails', e);
            let yelp = {
              yelp: null
            }
            index = index + 1;
            yelpData.push(yelp);
            iterateApiCalls(queries, index, yelpData)
          })
      }
    }
  })
}

const healthApi = function (queries, displayLimit){
  const healthData = [];

  return new Promise((resolve, reject) => {
    iterateApiCalls(queries, 0, healthData);
    function iterateApiCalls(queries, i, healthData) {
      if (i < displayLimit) {
        const url = queries[i].health.url;
        const request = queries[i].health.request;
 
        Promise.resolve(
          apiRequest(url, request)
        ).then((response) => {
          return response.json()
        }).then((data) => {
          healthData.push(data);
          iterateApiCalls(queries, i + 1, healthData);
        }).catch(e => {
          let health = { name: null }
          healthData.push(health);
          iterateApiCalls(queries, i + 1, healthData);
        })
      }
      else {
        resolve(healthData);
      }
    }
  })
}

async function apiRequest(endpoint, request) {
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


module.exports = { yelpApi, healthApi }