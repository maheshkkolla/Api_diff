var express = require('express');
var router = express.Router();
var privateModules = require("../own_modules/privateModules.js");
var fs = require('fs');
/* GET home page. */



var file1 = JSON.parse(fs.readFileSync("./qa.json"));
var file2 = JSON.parse(fs.readFileSync("./preprod.json"));

router.get('/', function(req, res, next) {
	privateModules.getAllApisDiff(file1, file2, function(apis){
		res.render('index', { apis: apis });
	});	
});

router.get('/merchandise_platform',function(req,res,next) {
	privateModules.getDiffForService('merchandise_platform' ,function(apis) {
		res.render('index', { apis: apis });
	});
});
router.get('/configurations',function(req,res,next) {
	privateModules.getDiffForService('configurations', function(apis) {
		res.render('index', { apis: apis });
	});
});
router.get('/drafts',function(req,res,next) {
	privateModules.getDiffForService('drafts',function(apis) {
		res.render('index', { apis: apis });
	});
});
router.get('/overlays',function(req,res,next) {
	privateModules.getDiffForService('overlays',function(apis) {
		res.render('index', { apis: apis });
	});
});
router.get('/orders',function(req,res,next) {
	privateModules.getDiffForService('orders',function(apis) {
		res.render('index', { apis: apis });
	});
});
router.get('/contracts',function(req,res,next) {
	privateModules.getDiffForService('contracts',function(apis) {
		res.render('index', { apis: apis });
	});
});
router.get('/promotions',function(req,res,next) {
	privateModules.getDiffForService('promotions',function(apis) {
		res.render('index', { apis: apis });
	});
});
router.get('/authorization',function(req,res,next) {
	privateModules.getDiffForService('authorization',function(apis) {
		res.render('index', { apis: apis });
	});
});
router.get('/geco_integration',function(req,res,next) {
	privateModules.getDiffForService('geco_integration',function(apis) {
		res.render('index', { apis: apis });
	});
});
router.get('/costs',function(req,res,next) {
	privateModules.getDiffForService('costs',function(apis) {
		res.render('index', { apis: apis });
	});
});
module.exports = router;
