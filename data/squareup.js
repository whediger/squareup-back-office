var request = require('request');
require('dotenv').config();

module.exports = {
  getSales: function(){
    return new Promise(function(fulfill, reject){
      var options = {
                     methed: 'GET',
                        url: 'https://connect.squareup.com/v2/locations',
                    headers: {
                              Authorization: 'Bearer ' + process.env.STELLAS_ACCESS_TOKEN,
                                     Accept: 'application/json',
                             'Content-Type': 'application/json'
                    }

      }
      request(options, function(err, res, data){
        console.log(data);
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
