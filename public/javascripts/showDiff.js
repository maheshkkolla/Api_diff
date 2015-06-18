var show = function(ele) {
  var api = ele.options[ele.selectedIndex].value;
  displayDifference(api)  
}

var displayDifference = function(api) {
  api = JSON.parse(api);
  $("#path").html(api.path);
  $("#path").append("&emsp; Method: "+api.method);
  var oldJson = formatJson(api.diff.old)
  var newJson = formatJson(api.diff.new)


  $("#old").html(JSON.stringify(oldJson));
  $("#new").html(JSON.stringify(newJson));
}


var formatJson = function(json) {
  var openObject = "{<div class='container'><b class='pin glyphicon glyphicon-minus' onclick='showOrHide(this)'></b><i>";
  json = JSON.stringify(json);
  json = json.replace(/\"/g,"");
  json = json.replace(/\{/g,openObject);
  json = json.replace(/\}/g,"</i></div> }");
  json = json.replace(/,/g,", <br>");
  json = json.replace(/\\/g,"");
  return json;
}


var showOrHide = function(thisEle) {
  var ele = $(thisEle).next();
  if(ele.is(":visible")){
    $(ele).hide();
    $(thisEle).attr("class","pin glyphicon glyphicon-plus");
  } 
  else {
    $(ele).show();
    $(thisEle).attr("class","pin glyphicon glyphicon-minus");
  }  
}

$(document).ready(function(){
  $("#apis").change();
});