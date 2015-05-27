var $ = require('jquery');
var Backbone = require('backbone');
var inputTemplate = require('../templates/inputView.dust');

var InputView = Backbone.View.extend({
  tagName: 'div',
  el: $('.input-container'),
  events: {
    'click .do-upload': 'doUpload'
  },
  _parseCsvToArray: function (csv) {

  },
  doUpload: function (e) {
    // Don't submit the form, because button defaults are stupid
    e.preventDefault();

    // Call to our capture function and pass it the form file
    debugger;
  },
  render: function () {
    var that = this;
    inputTemplate({}, function (err, html) {
      that.$el.html(html);
    })
  }
});

module.exports = InputView;