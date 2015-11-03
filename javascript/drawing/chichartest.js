function context(w,h) {

	var ccanvas1 = new chicharcanvas();
	var ccanvas2 = new chicharcanvas();
	
	ccanvas1.init("chicharcanvasdef",    "chicharstrokedef", "",    w, h);
	ccanvas2.init("chicharcanvasanswer", "chicharstrokeanswer", "", w, h);

	var iterframe = function() {
		ccanvas1.fiterstroke();
		ccanvas2.fiterstroke();
		return relaunchloop(true,iterframe);		
	}

	return iterframe;
}

startanim(context(500,500));
