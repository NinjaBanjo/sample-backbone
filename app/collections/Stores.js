var Backbone = require('backbone');
var Store = require('../models/Store');

var Stores = Backbone.Collection.extend({
  model: Store
});

module.exports = new Stores();