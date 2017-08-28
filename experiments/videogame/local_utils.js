var critterScale = 0.23;

var booleanFeatures = {
    // bird: {tail: "tar1", crest: "tar2", height: "prop1", fatness: "prop2"},
    // bug: {antennae: "tar1", wings: "tar2", headSize: "prop1", bodySize: "prop2"},
    // fish: {fangs: "tar1", whiskers: "tar2", bodySize: "prop1", tailSize: "prop2"},
    // flower: {thorns: "tar1", spots: "tar2", centerSize: "prop1", petalLength: "prop2"}
    bird: {
      tar1: {name: "tail", values: [0, 1]},
      tar2:  {name: "crest", values: [0, 1]},
      prop1:  {name: "height", values: [0, 1]},
      prop2:  {name: "fatness", values: [0, 1]}
    },
    bug: {
      tar1:  {name: "antennae", values: [0, 1]},
      tar2:  {name: "wings", values: [0, 1]},
      prop1:  {name: "headSize", values: [0, 1]},
      prop2:  {name: "bodySize", values: [0, 1]}
    },
    fish: {
      tar1:  {name: "fangs", values: [0, 1]},
      tar2:  {name: "whiskers", values: [0, 1]},
      prop1:  {name: "bodySize", values: [0, 0.8]},
      prop2:  {name: "tailSize", values: [0, 1]}
    },
    flower: {
      tar1:  {name: "thorns", values: [0, 1]},
      tar2:  {name: "spots", values: [0, 1]},
      prop1:  {name: "centerSize", values: [0, 1]},
      prop2:  {name: "petalLength", values: [0, 1]}
    }
}

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

// call this with blueTree to get blueTreeImg and blueTreeSvg created
var generateJS = function(idPrefix) {
	var imgID = idPrefix + "Img";
	var svgID = idPrefix + "Svg"; 

	var imgElement = document.createElement("img");
	imgElement.id=imgID;
	var element = document.getElementById("testdiv");
	$('#testdiv').append("<svg id='" + idPrefix + "'></svg>")
	element.appendChild(imgElement);
	
}

var createGameCritters = function(name, species, properties) {
	generateJS(name);
	Ecosystem.draw(species, properties, name, critterScale)
	return toImg(name);
}

var color_dict = {
    blue: "#5da5db",
    red: "#f42935",
    yellow: "#eec900",
    green: "#228b22",
    orange: "#ff8c00",
    purple: "#b62fef",
    pink: "#f97ada",
    lightblue: "#11edf4",
    lightgreen: "#11f427",
    lightpurple: "#dda0dd"
}

var blueBirdImg = createGameCritters("blueBird", "bird", {"tar1":0, "tar2":0, "prop1":0, "prop2":0, "col2":color_dict["blue"]})
