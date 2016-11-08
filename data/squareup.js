var request = require('request');
require('dotenv').config();

module.exports = {
  //TODO: add startdate and enddate params. And, location id in url
  getSales: function(){
    return new Promise(function(fulfill, reject){
      var options = { method: 'GET',
                        url: 'https://connect.squareup.com/v1/996NZP3EEMBXN/payments?begin_time=2015-01-15T00:00:00Z&end_time=2015-01-31T00:00:00Z',
                    headers:
                         { 'postman-token': '5ceddfb1-9d9e-2b6e-e8a1-07200fc04676',
                           'cache-control': 'no-cache',
                           'content-type': 'application/json',
                           accept: 'application/json',
                           authorization: 'Bearer ' + process.env.STELLAS_ACCESS_TOKEN }
                    }
      request(options, function(err, res, data){
        if (err) reject(err)
        else fulfill(data)
      });
    });
  },
  getLocations: function(){
    return new Promise(function(fulfill, reject){
      var options = { method: 'GET',
                        url: 'https://connect.squareup.com/v2/locations',
                    headers:
                         { 'postman-token': '5ceddfb1-9d9e-2b6e-e8a1-07200fc04676',
                           'cache-control': 'no-cache',
                           'content-type': 'application/json',
                           accept: 'application/json',
                           authorization: 'Bearer ' + process.env.STELLAS_ACCESS_TOKEN }
                    }
        request(options, function (err, res, data) {
        if (err) reject(err);
        else fulfill(data);
      });
    });
  }
}
