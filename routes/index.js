var express = require('express');
var router = express.Router();
var logger = require('log4js').getLogger("statistics");
var moment = require('moment');

var fs = require('fs');
var util = require('util');
/*var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

var dolog = function(d) { //
  log_file.write(d + '\n');
  log_stdout.write(d + '\n'); //terminal print
};*/

var buildInfo = function(info, req) {
	var pre = '[statistics] - [' + (req.header('x-forwarded-for') || req.connection.remoteAddress) + '] - [' + moment().format('YYYY-MM-DD h:mm:ss.SSS') + '] - ' + info + '\n'
	return pre
}

var printlog = function(req, res, next) {

	var cip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	var body = '';

	req.addListener('data', function(chunk){
	  body += chunk;
	});

	req.addListener('error', function(error){
	  next(err);
	});

	req.addListener('end', function(chunk){
	  if (chunk) {
	    body += chunk;
	  }
	  /*
	  if (!body) {
	  	body = req.originalUrl;
	  }*/
	  //dolog(buildInfo(body, req));
	  body = body.replace(/^\{/, '{"cip":"' + cip + '",');
	  logger.info(body);
	  res.header("Access-Control-Allow-Origin", "*");
	  res.end();
	});
}



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'BORUI'});
});


router.get('/log', function(req, res, next) {
	res.end();
	/*logger.debug("get Some debug messages");
	logger.trace('Entering cheese testing');
	logger.debug('Got cheese.');
	logger.info('Cheese is Gouda.');
	logger.warn('Cheese is quite smelly.');
	logger.error('Cheese is too ripe!');
	logger.fatal('Cheese was breeding ground for listeria.');*/
});

router.get('/logger', function(req, res, next) {
	res.end('success');
})
router.post('/log', function(req, res, next) {
	res.end('success')
});
router.get('/api/error', function(req, res, next) {
	var c = a + b;
	res.end();
});
router.get('/api/error2', function(req, res, next) {
	var c = d + 10;
	res.end();
});
router.get('/probe', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	var appid = req.query.app_id;
	function callBack(err,data){  
	    if(err){  
	        res.end('download error, please retry!')
	    }else{  
	    	data = data.replace(/key:\s?xxx/ig, 'key:' + appid)
	        res.json({'probe':data});  
	    }  
	}  
	fs.readFile("public/javascripts/statis.min.js","utf-8",callBack);
});




router.post('/pf', function(req, res, next) {
	printlog(req, res, next);
});


router.post('/pv', function(req, res, next) {
	printlog(req, res, next);
});


module.exports = router;
