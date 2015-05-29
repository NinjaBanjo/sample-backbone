var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Stores = require('../collections/Stores');
var dataTemplate = require('../templates/dataView.dust');

var DataView = Backbone.View.extend({
  _buildDataURI: function(data) {
    return 'data:Application/octet-stream;base64,' + btoa(data);
  },
  el: $('.data-table'),
  template: dataTemplate,
  initialize: function () {
    _.bindAll(this, 'renderTemplate');
    Stores.on('reset', this.render, this);
  },
  render: function () {
    dataTemplate({stores: Stores.toJSON(), downloadURI: this.downloadURI()}, this.renderTemplate);
  },
  renderTemplate: function (err, html) {
    this.$el.html(html);
  },
  downloadURI: function() {
    return this._buildDataURI(unescape(encodeURIComponent(JSON.stringify(Stores.toJSON()))).replace('\r', '').replace('\n', ''));
  }
});

module.exports = DataView;