function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function substitute(
		/*String*/		template,
		/*Object|Array*/map,
    /*Object?*/		thisObject,
		/*Function?*/	transform) {

  // summary:
  //		Performs parameterized substitutions on a string. Throws an
  //		exception if any parameter is unmatched.
  // template:
  //		a string with expressions in the form `${key}` to be replaced or
  //		`${key:format}` which specifies a format function. keys are case-sensitive.
  // map:
  //		hash to search for substitutions
  // transform:
  //		a function to process all parameters before substitution takes
  //		place, e.g. mylib.encodeXML
  // thisObject:
  //		where to look for optional format function; default to the global
  //		namespace

  thisObject = thisObject || window;
  transform = transform || function (v) { return v; };

  return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function (match, key, format) {
    var value = map[key] || ("undefined" === typeof map[key] ? match : map[key]);
    format && (value = thisObject[format](value, key));
    return transform(value, key).toString();
  }); // String
}

module.exports = {
  formatTime: formatTime,
  substitute: substitute
}
