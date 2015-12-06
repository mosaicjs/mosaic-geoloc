# Mosaic Geoloc

Mosaic Geoloc consists of a few scripts facilitating the batch geocoding of addreses stored in CSV format:
- The script ```csv-to-json``` converts CSV files to JSON using [mosaic-distil](https://github.com/ubimix/mosaic-distil). The conversion can be parameterized by editing the mapping configuration directly in the code for the moment.
- The script ```geolocate``` converts JSON file to GeoJSON by retrieving geographical coordinates from external geocoding services.


## Installation

Requirements:
- NodeJS environmnent

### Dependency installation

```npm install```

### Issue with Mosaic-Distil KmlDataProvider

A Mosaic-Distil file has to be edited before execution due to a bug in the KmlDataProider: in the file './node_modules/mosaic-distil/src/index.js', the line containing 'KmlDatProvider' has to be deleted.


## Usage

- Convert CSV files to JSON by running ```node ./01.csv-to-json.js```
- Convert JSON to GeoJSON by running ```node ./02.geolocate.js```
