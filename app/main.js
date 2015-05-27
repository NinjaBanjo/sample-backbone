var jQuery = require('jquery').noConflict();
var _ = require('lodash');
var Backbone = require('backbone');

var InputView = require('./views/inputView');
var DataView = require('./views/dataView');

new InputView().render();
new DataView().render();