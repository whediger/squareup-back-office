var fs = require('fs');

module.exports = {
  getSales: function(){
    return new Promise(function(fulfill, reject){
      //replace with api calls
      fs.readFile('./listPayments.json', (err, data) => {
        data = JSON.parse(data);
        if(err) reject(err);
        else fulfill(data);
      });
    });
  }
}
