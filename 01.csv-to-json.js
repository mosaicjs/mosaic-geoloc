var Fs = require('fs');

var _ = require('underscore');
var Diacritics = require('diacritics');

var Mosaic = require('mosaic-commons');
var MosaicDistil = require('mosaic-distil');
var Utils = require('mosaic-distil/transform-utils');

var DATA_FOLDER = './data/';

var listener = new MosaicDistil.WriteListener({
  dataFolder: DATA_FOLDER
});
listener = new MosaicDistil.LogListener({
  listener: listener,
});

var dataSets = [Entities('data.csv', 'startup')];

var dataProvider = new MosaicDistil.CsvDataProvider({
  dataSets: dataSets,
  dataFolder: DATA_FOLDER,
  forceDownload: true
})
return dataProvider.handleAll(listener).then(function(err) {
  console.log('>> DONE');
}).done();

/* ------------------------------------------------------------ */

function Entities(path, category) {
  return Utils.newDataSet({
    path: path,
    csvOptions: {
      delim: ','
    },
    transform: function(props) {
      var that = this;
      var result = {
        type: 'Feature',
        properties: _.extend({
          id: that.getId(props),
          category: category,
        }, that._toProperties(props, {
          exclude: ['category']
        }))
      };

      var tagCount = [1, 2, 3];
      var tags = [];
      _.each(tagCount, function(idx) {
        var tagPropName = "tag" + idx;
        var tag = result.properties[tagPropName];
        if (tag != undefined && tag.length > 0)
          tags.push(tag);
        delete result.properties[tagPropName];
      });
      result.properties.tags = tags;

      return Mosaic.P(result);
    },

    getId: function(props) {
      var str = props.name;
      str = str.replace(/^\s+|\s+$/gim, '');
      str = str.toLowerCase();
      str = str.replace(/\.+/gim, '');
      str = str.replace(/\s+/gim, '-');
      str = str.replace(/-+/gim, '-');
      str = str.replace(/'/gim, '-');
      str = str.replace(/"/gim, '');
      str = Diacritics.remove(str);
      return str;
    },

  });
}

function capitalize(str) {
  var capitalized = str.charAt(0).toUpperCase() + str.substring(1);
  return capitalized;
}

function normalize(str) {
  str = trim(str);
  str = str.replace(/\s+/gim, ' ');
  return str;
}

function trim(str) {
  if (!str)
    return str;
  str = str.replace(/^\s+|\s+$/gim, '');
  return str;
}
