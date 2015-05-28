var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Promise = require('bluebird');
var inputTemplate = require('../templates/inputView.dust');
var Stores = require('../collections/Stores');

var InputView = Backbone.View.extend({
  _getGeoLocationForObjects: function (objects) {
    return new Promise(function (resolve) {
      // Do geo stuff here
      var Geocoder = new google.maps.Geocoder;
      // we use map so it only runs one at a time and cuncurrency so it waits for the previous before calling the next one
      Promise.map(objects, function (item) {
        return new Promise(function (resolve) {
          var address = item.address + ' ' + item.city + ' ' + item.state + ' ' + item.zip;
          Promise.delay(1000)
            .then(function () {
              Geocoder.geocode({address: address}, function (result) {
                if (result !== null && typeof result[0] !== "undefined") {
                  item.lat = result[0].geometry.location.A;
                  item.lon = result[0].geometry.location.F;
                } else {
                  item.lat = null;
                  item.lon = null;
                }
                resolve(item);
              });
            });
        });
      }, {concurrency: 1})
        .then(function (processedObjects) {
          resolve(processedObjects);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  },
  _parseCsvToObject: function (csvData) {
    return new Promise(function (resolve) {
      // Resolve with the parsed objects
      resolve(csvData.split("\n")
        .map(function (e, i, a) {
          // Skip the first entry
          if (i < 1) {
            return undefined
          }
          // Split into parts and return an object with each of the attributes
          var info = e.split(',');
          return {
            id: info[0],
            alt: info[1],
            url: info[2],
            name: info[3],
            phone: info[4],
            monday: info[5],
            tuesday: info[6],
            wednesday: info[7],
            thursday: info[8],
            friday: info[9],
            saturday: info[10],
            sunday: info[11],
            type: info[12],
            address: info[13],
            city: info[14],
            state: info[15],
            zip: info[16]
          };
        })
        .filter(function (e, i, a) {
          return !(typeof e === "undefined");
        }));
    });
  },
  _readFileText: function (file, cb) {
    return new Promise(function (resolve) {
      var fileReader = new FileReader();

      fileReader.onload = function () {
        resolve(fileReader.result);
      };

      fileReader.readAsText(file);
    });
  },
  tagName: 'div',
  el: $('.input-container'),
  events: {
    'click .do-upload': 'doUpload'
  },
  doUpload: function (e) {
    // Don't submit the form, because button defaults are stupid
    e.preventDefault();
    // Get the file object and check to make sure it's a csv
    var file = this.$el.find('input')[0].files[0];
    if (typeof file === "undefined") {
      alert('Please choose a file!');
      return;
    }
    if (file.type !== "text/csv") {
      alert('Only csv files are allowed, sorry.');
      return;
    }
    // Call to our capture function and pass it the form file=
    this._readFileText(file)
      .then(this._parseCsvToObject)
      .then(this._getGeoLocationForObjects)
      .then(function(result){
        StorZ
      });

  },
  render: function () {
    var that = this;
    inputTemplate({}, function (err, html) {
      that.$el.html(html);
    });
    return this;
  }
});

module.exports = InputView;