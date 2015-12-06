var Fs = require('fs');

var _ = require('underscore');
var Geocoder = require('geocoder');

var Mosaic = require('mosaic-commons');
var MosaicDistil = require('mosaic-distil');
var Utils = require('mosaic-distil/transform-utils');

var DATA_FOLDER = './data/';

var listener = new MosaicDistil.WriteListener({
  dataFolder: DATA_FOLDER
});

listener._getDestFile = function(info) {
  return this._setExtension(info.fileName, '.geojson');
}

listener = new MosaicDistil.LogListener({
  listener: listener,
});

//var dataSets = [ EcolesInstitutsAmbassades(), PepinieresPribl() ];
var dataSets = [Organizations()];
var dataProvider = new MosaicDistil.JsonDataProvider({
  dataSets: dataSets,
  dataFolder: DATA_FOLDER,
  forceDownload: true
})
return dataProvider.handleAll(listener).then(function(err) {
  console.log(err.stack);
}).done();

function geocode(obj) {
  var props = obj.properties;
  var str = '';
  if (props.address)
    str = props.address + ', '
  var addr = str + (props.postcode || '') + ' ' + props.city + ', ' + props.country;
  //var addr = props.city + ' ' + props.country;
  if (obj.geometry)
    return Q(obj);
  else {
    console.log('>>>> GEOCODING ADDR FOR', props.name);
    console.log('\t' + addr);
    //return obj;
    return Mosaic.P.ninvoke(Geocoder, 'geocode', addr).then(function(geoData) {
      var geom = geoData.results[0];
      if (geom && geom.geometry && geom.geometry.location) {
        var lat = geom.geometry.location.lat;
        var lng = geom.geometry.location.lng;
        obj.geometry = {
          type: 'Point',
          coordinates: [lng, lat]
        };
      } else {
        console.log('>>>> NO GEOLOCATION FOUND FOR', props.name);
        obj.geometry = {
          type: 'Point',
          coordinates: [2, 48]
        };
      }
      return Mosaic.P.delay(500).then(function() {
        return obj;
      });
    });
  }

}

function Organizations() {
  return Utils.newDataSet({
    "path": "data.json",
    transform: function(object) {
      return geocode(object);
      //return Q(props);
    },
  });
}
