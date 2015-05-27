var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Stores = require('../collections/Stores');
var dataTemplate = require('../templates/dataView.dust');

var DataView = Backbone.View.extend({
  el: $('.data-table'),
  template: dataTemplate,
  initialize: function () {
    _.bindAll(this, 'renderTemplate');
    Stores.on('reset', this.render, this);
  },
  render: function () {
    dataTemplate({stores: Stores.toJSON()}, this.renderTemplate);
    return this;
  },
  renderTemplate: function (err, html) {
    this.$el.html(html);
  }
});

module.exports = DataView;