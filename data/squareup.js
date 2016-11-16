var request = require('request');
require('dotenv').config();

module.exports = {
  //TODO: add startdate and enddate params. And, location id in url
  getSales: function(){
    return new Promise(function(fulfill, reject){
      var results = {};
      results.catagories = {};
      results.catagoryTotal = 0;
      results.totalSales = 0;
      var options = { method: 'GET',
                         url: 'https://connect.squareup.com/v1/' + process.env.LOCATION_ID + '/payments?begin_time=2016-02-01T00:00:00Z&end_time=2016-02-02T00:00:00Z',
                     headers:
                         { 'postman-token': '5ceddfb1-9d9e-2b6e-e8a1-07200fc04676',
                           'cache-control': 'no-cache',
                            'content-type': 'application/json',
                                    accept: 'application/json',
                                     limit: '200',
                             authorization: 'Bearer ' + process.env.STELLAS_ACCESS_TOKEN
                         }
                    }
      request(options, function(err, res, data){
        data = JSON.parse(data);
        results.totalSales += module.exports.getTotalSales(data);
        results.catagories = module.exports.getCatagorySales(data, results);
        if (err) reject(err)
        else {
          if (res.headers.link){
            results = module.exports.getMorePages(res.headers.link, data, results);
            fulfill(results);
          }
          else fulfill(results)
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
                             authorization: 'Bearer ' + process.env.STELLAS_ACCESS_TOKEN
                         }
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
      totalSales += data[i].net_sales_money.amount;
    }
    return totalSales;
  },
  getMorePages: function(url, dataIn, resultsIn){
    //parse url from returned url string;
    var dataArray = dataIn;
    var results = resultsIn;
    //parse url from string
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
                                     limit: '200',
                             authorization: 'Bearer ' + process.env.STELLAS_ACCESS_TOKEN
                         }
                    }
      request(options, function(err, res, data){
        data = JSON.parse(data);
        results.totalSales += module.exports.getTotalSales(data);
        results.catagories = module.exports.getCatagorySales(data, results);
        if (err) reject(err)

        if (res.headers.link) {
          results = module.exports.getMorePages(res.headers.link, data, results);
          fulfill(results);
        }
        if (!res.headers.link) {
          fulfill(results);
        }
      });
    });
  },
  getCatagorySales: function(data, resultsIn){
    var results = resultsIn;
    for (var i in data){
      for (var e in data[i].itemizations)
        var catagoryName = data[i].itemizations[e].item_detail.category_name;
        if(!catagoryName) {
          if (results.catagories.uncatagorized) {
            results.catagories.uncatagorized.totalSales += data[i].itemizations[e].net_sales_money.amount;
            results.catagoryTotal += data[i].itemizations[e].net_sales_money.amount;
            results.catagories.uncatagorized.items += 1;
          } else {
            results.catagories.uncatagorized = {};
            results.catagories.uncatagorized.totalSales = data[i].itemizations[e].net_sales_money.amount;
            results.catagoryTotal += data[i].itemizations[e].net_sales_money.amount;
            results.catagories.uncatagorized.items = 1;
          }
        } else {
          if (results.catagories[catagoryName]){
            results.catagories[catagoryName].totalSales += data[i].itemizations[e].net_sales_money.amount;
            results.catagories[catagoryName].items += Math.floor(data[i].itemizations[e].quantity);
            results.catagoryTotal += data[i].itemizations[e].net_sales_money.amount;
          } else {
            results.catagories[catagoryName] = {};
            results.catagories[catagoryName].totalSales = data[i].itemizations[e].net_sales_money.amount;
            results.catagories[catagoryName].items = Math.floor(data[i].itemizations[e].quantity);
            results.catagoryTotal += data[i].itemizations[e].net_sales_money.amount;
          }
        }
    }
    return results.catagories;
  }
}
