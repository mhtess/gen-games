function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// Encode real numbers
function encodeData(dataObj){
  return _.mapObject(dataObj, function(val, key) {
    if (isNumeric(val)) {
      if (Number.isInteger(val)) {
        return val.toString()
      } else {
      return val.toString().replace(".", "&")
      }
    } else { return val }
  });
}