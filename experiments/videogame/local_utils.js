var toImg = function(original) {
	//converts
	function svgDataURL(svg) {
	  var svgAsXML = (new XMLSerializer).serializeToString(svg);
	  return "data:image/svg+xml," + encodeURIComponent(svgAsXML);
	}

	var can = document.createElement('canvas')
	var ctx = can.getContext('2d')
	var targetImage = document.querySelector('#'+original)
	var svg  = document.querySelector('#'+original)
	var loader = new Image

	targetImage.src = svgDataURL(svg);

	loader.width = can.width
	loader.height = can.height

	loader.onLoad = function(){
		ctx.drawImage(loader, 0, 0, loader.width, loader.height)
		targetImage.src = can.toDataURL()
	}

	loader.src = svgDataURL(svg)

	return loader.src
}