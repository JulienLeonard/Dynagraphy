function context(canvasname, w,h) {

	var ccanvas = new chicharcanvas();
	
	ccanvas.init(canvasname, w, h);

	ccanvas.attachevents();

	var iterframe = function() {
		ccanvas.fiterstroke();
		return relaunchloop(true,iterframe);		
	}

	return iterframe;
}

startanim(context("chicharcanvas", 750, 750));
