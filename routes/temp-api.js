var express = require('express'),
    router = express.Router(),
    temp = require('../lib/temp'),
    util = require('util'),
    data = require('../lib/data-sqlite');

/* GET users listing. */
router.get('/current-temp', function(req, res) {
  temp.current(function(current_temp){
    res.send({ current_temp: current_temp });
  });
});

router.get('/temp-data', function(req, res) {
  var today = (new Date).getTime();
  if(req.query.end) today = req.query.end;
  data.get(['batch', today - 604800000, today], function(temp_data) {
    var temp_array = [];
    temp_data.forEach(function(data) {
      var reading = [data.time, data.temperature];
      temp_array.push(reading);
    });
    data.downSample(temp_array, 1000, function(temp_sample){
      var tempData = {
        label: "Temperature",
        data: temp_sample
      };
      res.send(tempData);
    });
  });
});

router.get('/target-data', function(req, res) {
  var today = (new Date).getTime();
  if(req.query.end) today = req.query.end;
  data.getTargets(['batch', today - 6048000000, today], function(target_data) {
    var target_array = [];
    target_data.forEach(function(data) {
      target_array.push([data.time, data.temperature]);
    });
    data.target('batch', function(current_target) {
      target_array.push([today, current_target.temperature]);
      var targetData = {
        label: "Target",
        data: target_array,
        color: "#2C3E50"
      };
      res.send(targetData);
    });
  });
});

router.get('/all-temp-data', function(req, res) {
  data.get(['batch', 0, -1], function(temp_data) {
    var temp_array = [];
    temp_data.forEach(function(data) {
      var reading = [data.time, data.temperature];
      temp_array.push(reading);
    });
    res.send(temp_array);
  });
});

router.get('/', function(req, res) {

});

module.exports = router;
