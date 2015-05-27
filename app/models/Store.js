var Backbone = require('backbone');

var Store = Backbone.Model.extend({
  defaults: {
    id: undefined,
    alt: undefined,
    url: undefined,
    name: undefined,
    phone: undefined,
    monday: undefined,
    tuesday: undefined,
    wednesday: undefined,
    thursday: undefined,
    friday: undefined,
    saturday: undefined,
    sunday: undefined,
    type: undefined,
    address: undefined,
    city: undefined,
    state: undefined,
    zip: undefined
  }
});

module.exports = Store;