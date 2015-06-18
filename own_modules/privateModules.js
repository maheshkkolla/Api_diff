var jsonDiff = require('diff-json');
var fs = require('fs');
var pg = require('pg');
var privateModules = {};
module.exports = privateModules;
var CHANGE_TEMPLATE = "<b class='@CLASS@'> @VALUE@ </b>"
var CONN_STR = 'postgres://localhost:5432/api_logs'; 

privateModules.getDiffForService = function(service, callback){
	getWadls(service, function(todayWadl, yesterdayWadl) {
		privateModules.getAllApisDiff(yesterdayWadl.wadl, todayWadl.wadl, callback);
	});
}

var getWadls = function(service, callback) {
	getWadl(1, service, function(todayWadl) {
		getWadl(2, service, function(yesterdayWadl) {
			callback(todayWadl, yesterdayWadl);
		});
	});
}

var getQueryForWadl = function(day, service) {
	return("SELECT wadl FROM API_HISTORY WHERE " + 
		"API_DATE = now()::date-" + day + 
		" AND SERVICE='" + service + "'");
}

var getWadl = function(day, service, callback) {
	var qryStr = getQueryForWadl(day, service);
	console.log(qryStr);
	pg.connect(CONN_STR, function(err, client, done) {
		var query = client.query(qryStr);
		err && console.log(err);
		query.on('row', callback);
		query.on('end', function() {
			client.end();
		});
	});
} 

privateModules.getAllApisDiff = function(todayWadl, yesterdayWadl, callback) {
	todayWadl = todayWadl.resources;	
	yesterdayWadl = yesterdayWadl.resources;
	var apis = [];
	todayWadl.forEach(function(resource) {
		var api = {};
		api.path = resource.resource.path;
		api.method = resource.resource.method;
		var secoundJson = getSecoundWadlOfPath(yesterdayWadl, api.path, api.method);
		if(secoundJson) {
			var diff = jsonDiff.diff(resource, secoundJson);
			(diff.length>0) && (api.diff = makeObject(diff[0]));
			(diff.length>0) && apis.push(api);
		}
	});
	callback(apis);
}

var getSecoundWadlOfPath = function(wadl, path, method) {
	var json = false;
	wadl.forEach(function(resource) {
		if((path==resource.resource.path) && (method == resource.resource.method)) json = resource;
	});
	return json;
}

var appendNextToOldObject = function(original, next, key) {
	original.old[key] = next['old'];
	original.new[key] = next['new'];
	return original;
}

var handleChanges = function(changes, result) {
	changes.map(function(change,index) {
		result = appendNextToOldObject(result, makeObject(change), change.key);
	});
	return result;
}

var makeObject = function(diff) {
	var result = {old:{}, new:{}};
	var key = diff.key;
	if(diff.changes) result = handleChanges(diff.changes, result);
	else result = handlers[diff.type](diff);
	return result;	
}

var handlers = {
	update: function(diff){
		var value = CHANGE_TEMPLATE.replace(/@CLASS@/g,'alert-warning');
		var oldValue = value.replace(/@VALUE@/g,JSON.stringify(diff.oldValue));
		var newValue = value.replace(/@VALUE@/g,JSON.stringify(diff.value));
		return {old: oldValue, new: newValue};
	},
	remove: function(diff) {
		var value = CHANGE_TEMPLATE.replace(/@CLASS@/g, 'alert-danger');
		value = value.replace(/@VALUE@/g, JSON.stringify(diff.value));
		return {old:value};
	},	
	add: function(diff) {
		var value = CHANGE_TEMPLATE.replace(/@CLASS@/g, 'alert-success');
		value = value.replace(/@VALUE@/g, JSON.stringify(diff.value));
		return {new:value};
	}
}