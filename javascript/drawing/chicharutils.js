

function Chichar() {
	this.strokes = [];
}

function Stroke() {
	this.points = [];
}


function chidrawcircle(canvas,x,y) {
	console.log("chidrawcircle" + x + y);
	drawcircle(canvas,circle(x * 10.0,y * 10.0,0.3),Color.prototype.black());
}

var getcenteredcoords = function(canvasframe, e) {
	console.log("canvasframe",canvasframe);
	var rect = canvasframe.getBoundingClientRect();
	// var mouseX = e.clientX - rect.left;
	// var mouseY = e.clientY - rect.top;
	if (e.touches) {
		if (e.touches.length == 1) { // Only deal with one finger
			e = e.touches[0]; // Get the information for finger #1
		}
	}

	var mouseX = e.pageX-e.target.offsetLeft;
	var mouseY = e.pageY-e.target.offsetTop;
	var x =   (mouseX / canvasframe.width)  * 2 - 1;
	var y = - (mouseY / canvasframe.height) * 2 + 1;
	return new Point(x,y);
}


