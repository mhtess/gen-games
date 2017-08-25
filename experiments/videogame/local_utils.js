//draws to img1 which is an svg file
// var scale = 0.5;
// Ecosystem.draw("tree", {"tar1":true, "tar2":true, "prop1":1, "prop2":1}, "img1", scale)

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

	//console.log("!" + newPic)

	// targetImage.width = can.width
	// targetImage.height = can.height
	loader.width = can.width
	loader.height = can.height

	loader.onLoad = function(){
		ctx.drawImage(loader, 0, 0, loader.width, loader.height)
		targetImage.src = can.toDataURL()
	}

	loader.src = svgDataURL(svg)
	// targetImage.style.display = "none"

	return loader.src
}

// toImg("img1")