var mysql = require('mysql');
var config = require('./web-config.json');
var connection = mysql.createConnection(config.mysql);


connection.connect(function(err){
  if(err){
    console.log("Error connecting to db");
    return;
  }
  console.log("connection established");
});
/*

 GET /?alt=0.0&code=0xF020&id=123456789012345&gprmc=%24GPRMC%2C191019.951%2CA%2C5023.32513%2CN%2C3029.62911%2CE%2C0.000000%2C0.000000%2C301213%2C%2C*3A HTTP/1.1
 Host: 31.131.16.130:10100
 Connection: Keep-Alive
 User-Agent: android-async-http/1.4.1 (http://loopj.com/android-async-http)
 Accept-Encoding: gzip
 */


exports.imei = function(data) {
  var text = '' + data;
  // text = text.split('HTTP')[0];
  // text = text.replace(/\s/g, "");
  // text = text.replace(/GET/g, "");


  var arr = text.split('|');
  // var obj = {};
  // for (var i = 0; i < arr.length; i++) {
  //     obj[arr[i].split('=')[0]] = arr[i].split('=')[1]
  // }
  /*
   for(var opt in obj){
   console.log(opt + ': '+obj[opt] );
   }
   text  = obj['gprmc'];
   */

  var imei = arr[1];

  return imei;
}
exports.res = function(data) {
  var text = '' + data;
  var arr = text.split('');
  var res = '';
  for (var i = 1; i < 4; i++) {
    res += arr[i];
  }
  return '__' + res + '\r\n';
}
exports.params = function(data) {
  //$GM231869158002854111T161012161240N50233157E03029611200024995730298#
  var sourcedata;
  var params;
  var imei = this.imei(data);

  // console.log('imei'+imei);
  var text = '' + data;
  var arr = text.split('|');
  // ^TMPER|354678456723764|1|12.59675|77.56789|123456|030414|2.3|34|1|0|0|0.015|3.9|12.0|23.4|23.4|1|1|0|#

  var datetime = '';
  var azimuth = '';
  var lat = '';
  var lng = '';
  var speed = '';
  var sputnik = '';
  var zaryad = '';
  var tc = '';

  if ('' + arr[0] == '^TMPER') {

    datetime = '' + arr[6].split("")[4] + arr[6].split("")[5] + arr[6].split("")[2] + arr[6].split("")[3] + arr[6].split("")[0] + arr[6].split("")[1] + arr[5];


    lat = '' + arr[3];
    lat = parseFloat(lat);

    lng = '' + arr[4];
    lng = parseFloat(lng);

    speed = '' + arr[7];
    speed = parseFloat(speed);

    azimuth = '' + arr[8];
    azimuth = parseFloat(azimuth);

    sputnik = '';
    zaryad = '';
    tc = '';
    sourcedata = '';

    params = {
      imei: imei,
      datetime: datetime,
      lat: lat,
      lng: lng,
      speed: speed,
      azimuth: azimuth,
      sputnik: sputnik,
      zaryad: zaryad,
      tc: tc,
      sourcedata: sourcedata
    }

  }
  //
  return params;
}

exports.save = function(data) {
  console.log('inside save');
var query=  connection.query('INSERT INTO log SET ?', data, function(err, result) {
    if (err) {
      console.log(err);
    }
  });

  console.log(query.sql);
}
