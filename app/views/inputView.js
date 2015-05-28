var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Promise = require('bluebird');
var CSV = require('csv-js');
var inputTemplate = require('../templates/inputView.dust');
var Stores = require('../collections/Stores');

var InputView = Backbone.View.extend({
  tagName: 'div',
  el: $('.input-container'),
  events: {
    'click .do-upload': 'doUpload'
  },
  _getGeoLocationForObjects: function (objects) {
    return new Promise(function (resolve) {
      // Do geo stuff here
      var Geocoder = new google.maps.Geocoder;
      // we use map so it only runs one at a time and cuncurrency so it waits for the previous before calling the next one
      Promise.map(objects, function (item) {
        return new Promise(function (resolve) {
          var callTime = new Date(),
            finishTime = new Date(callTime.getTime() + 0.12 * 60000),
            address = item.address + ' ' + item.city + ' ' + item.state + ' ' + item.zip;
          Geocoder.geocode({address: address}, function (result) {
            if (result !== null && typeof result[0] !== "undefined") {
              item.lat = result[0].geometry.location.A;
              item.lon = result[0].geometry.location.F;
            } else {
              item.lat = null;
              item.lon = null;
            }
            var checkTime = setInterval(function () {
              var now = new Date();
              if (now.getTime() >= finishTime.getTime()) {
                clearTimeout(checkTime);
                resolve(item);
              }
            }, 500);
          });
        });
      }, {concurrency: 5})
        .then(function (processedObjects) {
          resolve(processedObjects);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  },
  _parseCsvToObject: function (csvData) {
    return new Promise(function (resolve) {
      // Resolve with the parsed objects
      debugger;
      resolve(CSV.parse(csvData)
        .map(function (e, i, a) {
          // Skip the first entry
          if (i < 1) {
            return undefined
          }
          // Split into parts and return an object with each of the attributes
          return {
            id: e[0],
            alt: e[1],
            url: e[2],
            name: e[3],
            phone: e[4],
            monday: e[5],
            tuesday: e[6],
            wednesday: e[7],
            thursday: e[8],
            friday: e[9],
            saturday: e[10],
            sunday: e[11],
            type: e[12],
            address: e[13],
            city: e[14],
            state: e[15],
            zip: e[16]
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
    var workingNode = document.querySelector('.working');
    workingNode.style.display = 'inline-block';
    var startTime = new Date();
    this._readFileText(file)
      .then(this._parseCsvToObject)
      .then(this._getGeoLocationForObjects)
      .then(function (result) {
        Stores.reset(result);
        workingNode.style.display = '';
        var endTime = new Date();
        var timeTaken = new Date(startTime.getTime() - endTime.getTime());
        console.log('Time Taken: ' + timeTaken.getSeconds());
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