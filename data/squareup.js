var request = require('request');
require('dotenv').config();

module.exports = {
  //TODO: add startdate and enddate params. And, location id in url
  getSales: function(){
    return new Promise(function(fulfill, reject){
      var totalSales = 0;
      var options = { method: 'GET',
                        url: 'https://connect.squareup.com/v1/996NZP3EEMBXN/payments?begin_time=2015-01-17T00:00:00Z&end_time=2015-01-18T00:00:00Z',
                    headers:
                         { 'postman-token': '5ceddfb1-9d9e-2b6e-e8a1-07200fc04676',
                           'cache-control': 'no-cache',
                           'content-type': 'application/json',
                           accept: 'application/json',
                           authorization: 'Bearer ' + process.env.STELLAS_ACCESS_TOKEN }
                    }
      request(options, function(err, res, data){
        data = JSON.parse(data);
        totalSales = module.exports.getTotalSales(data);
        if (err) reject(err)
        else {
          if (res.headers.link){
            totalSales = module.exports.getMorePages(res.headers.link, totalSales)
            fulfill(totalSales);
          }
          else fulfill(totalSales)
        }
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
  },
  getTotalSales: function(data){
    var totalSales = 0;
    for (var i in data){
      totalSales += data[i].total_collected_money.amount;
    }
    return totalSales;
  },
  getMorePages: function(url, totalSales){
    //parse url from returned url string;
    var salesTotal = totalSales;
    for ( var i = 0; i < url.length; i++){
      if (url.charAt(i) == '>'){
        url = url.substr(1, (i - 1));
      }
    }
    return new Promise(function(fulfill, reject){
      var options = { method: 'GET',
                         url: url,
                     headers:
                         { 'postman-token': '5ceddfb1-9d9e-2b6e-e8a1-07200fc04676',
                           'cache-control': 'no-cache',
                            'content-type': 'application/json',
                                    accept: 'application/json',
                             authorization: 'Bearer ' + process.env.STELLAS_ACCESS_TOKEN }
                    }
      request(options, function(err, res, data){
        data = JSON.parse(data);
        salesTotal += module.exports.getTotalSales(data);

        if (err) reject(err)

        if (res.headers.link) {
          salesTotal = module.exports.getMorePages(res.headers.link, salesTotal);
          fulfill(salesTotal);
        }
        if (!res.headers.link) {
          fulfill(salesTotal);
        }
      });
    });
  }
}


// paths to values +==}========>

//for sales data
//Total transaction amount: data[0].tender[0].total_money.amount;
