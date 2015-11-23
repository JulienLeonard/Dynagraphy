
function chicharcanvas() {
	this.canvasframe = null;
	this.canvas = null;
	this.viewviewbox = [-10.0,-10.0, 10.0,10.0];
	this.background = Color.prototype.white();
	this.savecoords    = null;
	this.coordindex    = null;
	this.currentstroke = null;
	this.chichar       = null;
}

//
// must return a function to iterframe
//
chicharcanvas.prototype.init = function(canvasname, w,h,isactive) {
	console.log("chicharcanvas.prototype.init this " + this + " this.canvasframe " + this.canvasframe);

	this.canvas = initcanvas(canvasname,w,h,this.background);

	resetviewbox(this.canvas,this.viewviewbox);

	this.canvasframe = canvasitem(canvasname);
};

chicharcanvas.prototype.fiterstroke = function() {

	resetviewbox(this.canvas,this.viewviewbox);

	if (this.patterns != null) {
		this.iterframe();
	}
};


chicharcanvas.prototype.ftouchdowndrawcircle = function(e) {
	console.log("trigger touchdowndrawcircle this " + this + " canvaframe " + this.canvasframe);
	this.savecoords = null;
	
	if (this.chichar == null) {
		this.chichar = new Chichar();
		this.currentstroke = null;
	}

	var p = getcenteredcoords(this.canvasframe,e)
	chidrawcircle(this.canvas,p,Color.prototype.black(),0.1);
	
	this.currentstroke = new Stroke();
	this.currentstroke.points.push(p);
	e.preventDefault();
};


chicharcanvas.prototype.ftouchupdrawcircle = function(e) {
	this.chichar.strokes.push(this.currentstroke);
		
	var startexpansion = false;
	var lcoords = [];
	for (var i = 0; i < this.chichar.strokes.length; i++) {
		var stroke = this.chichar.strokes[i];
		for (var j = 0; j < stroke.points.length; j++) {
			lcoords.push(stroke.points[j].x);
			lcoords.push(stroke.points[j].y);
		}
		lcoords.push(";,;");
		if (stroke.points.length == 1) {
			startexpansion = true
		}
	}
	var sstrokes = lcoords.join(',');
	this.currentstroke = null;

	if (startexpansion) {
		this.buildpatterns();

		//  add a frame to limit the circles. Only in quadtree, not in nodess
		var framecircle = new Circle(0.0,0.0,7.5);
		var framecenters = circlepoints(framecircle,3000,0.0);
		// chidrawcircle(this.canvas,framecircle,Color.prototype.black(),framecircle.r);
		for (var iframe = 0; iframe < framecenters.length; iframe++) {
			var framecenter  = framecenters[iframe];
			var cframe = new Circle(framecenter.x, framecenter.y,0.01);
			insertquadtree(this.quadtree,cframe);
			// chidrawcircle(this.canvas,cframe,Color.prototype.black(),cframe.r);
			// drawcircle(canvas,cframe,myhsla(0.0,1.0,0.5,1.0));
		}
	}
};


chicharcanvas.prototype.fmovedrawcircle = function(e) {
	if (this.currentstroke) {
		var p = getcenteredcoords(this.canvasframe,e)
		if (this.currentstroke.points.length> 0 && dist2(llast(this.currentstroke.points),p) > 0.1) {
			chidrawcircle(this.canvas,p,Color.prototype.black(),0.1);
			this.currentstroke.points.push(p)
		}
	}
	e.preventDefault();
};



chicharcanvas.prototype.attachevents = function(cccanvas) {
	console.log("attachevents cccanvas " + this + " canvas " + this.canvas + " canvasframe " + this.canvasframe);

	bindcanvas(this.canvasframe, "mousedown", this.ftouchdowndrawcircle.bind(this), false);
	bindcanvas(this.canvasframe, "mousemove", this.fmovedrawcircle.bind(this),      false);
	bindcanvas(this.canvasframe, "mouseup",   this.ftouchupdrawcircle.bind(this),   false);

	bindcanvas(this.canvasframe, "touchstart",this.ftouchdowndrawcircle.bind(this), false);
	bindcanvas(this.canvasframe, "touchmove", this.fmovedrawcircle.bind(this),      false);
	bindcanvas(this.canvasframe, "touchend",  this.ftouchupdrawcircle.bind(this),   false);
};

function bidirection(i,modulo) {
	if ((i % (2*modulo)) < modulo) {
		return i % modulo;
	} else {
		return modulo - (i % modulo);
	}
}


function fdraw(canvas,pattern,lastindex) {
	// var ncolor = myhsla(lastindex/10.0, 1.0, 0.5, 1.0);

	var newnode  = pattern.nodes[pattern.nodes.length-1];
	var lastnode = pattern.nodes[pattern.nodes.length-2];

	//var colorindex = newnode.colorindex;
	//var factor = 0.1;
	//var ncolor = myhsla((bidirection(colorindex,(14100*factor)) + 19000*factor)/(34100*factor), 1.0, bidirection(colorindex,(3410*factor))/(3410*1.1*factor),1.0);

	// var colorindex = newnode.colorindex;
	// var factor = 0.015;
	// var ncolor = myhsla((((colorindex)%(14100*factor) + 114100*factor/2.0)/(114100*factor)), 1.0, (((colorindex)%(14100*factor))/(14100*factor)),0.75);
	// var ncolor = myhsla((((colorindex)%(14100*factor))/(14100*factor)), 1.0, (((colorindex + 1700*factor * 0.99)%(1700*factor))/(2700*factor)),0.75);

	//var colorindex = newnode.colorindex;
	//var factor = 0.0045;
	//var ncolor = myhsla((bidirection(colorindex,(14100*factor)) + 19000*factor)/(34100*factor), 1.0, bidirection(colorindex,(3410*factor))/(3410*1.1*factor),1.0);

    var colorindex = newnode.colorindex;
	var factor = 1.0;
	var ncolor = myhsla(((colorindex%100)/1000.0), 1.0,bidirection(colorindex,(50*factor))/(50*1.1*factor),1.0);
    

	// console.log("fdraw circle",newnode,"ncolor",ncolor);

	// chidrawcircle(canvas,cscale(newnode,2.0),ncolor,newnode.r*1.0);
	if (arecircletangent(newnode,lastnode)) {
		rx1 = ccenter(newnode).x;
		ry1 = ccenter(newnode).y;
		rx2 = ccenter(lastnode).x;
		ry2 = ccenter(lastnode).y;

		for (i = 0; i <= 5; i++) {
			var abscissa = i/5.0;
			var newx = rx1 + (rx2-rx1) * abscissa;
			var newy = ry1 + (ry2-ry1) * abscissa;
            // render.drawcircle(Circle(newx,newy,newnode.r/2.0),ncolor);
			chidrawcircle(canvas,new Circle(newx,newy,newnode.r),ncolor,newnode.r/0.5);
		}
	}
}


chicharcanvas.prototype.createpattern = function(p,factor) {
	console.log("createpattern",p.x,p.y);
	var r = 0.075;
	var newnodes = [new Circle(p.x-r,p.y,r),new Circle(p.x+r,p.y,r)];

	// if (!checkcollisionquadtree(this.quadtree,newnodes[0],0.001) && !checkcollisionquadtree(this.quadtree,newnodes[1],0.001)) {
	if (true) {
		var inode = 0;
		for (inode = 0; inode < newnodes.length; inode++) {
			// var ncolor = myhsla((1%1600/(1600)), 1.0, 0.5, 1.0);
			insertquadtree(this.quadtree,cscale(newnodes[inode],0.5));
			chidrawcircle(this.canvas,newnodes[inode],Color.prototype.black(),newnodes[inode].r);
		}

			// var niter = 105;
			// var noffset = 3;
			// var ncircles = [];
			// for (var incircle = noffset; incircle < niter + noffset; incircle++) {
			// 	ncircles.push(Math.round(incircle * 6.5));
			// }
			// var bside = new BS();
			// for (var incircle = 0; incircle < niter - noffset; incircle++) {
			// 	bside.push(ncircles[incircle]).alts(samples(1,75,8));
			// 	// bside.push(ncircles[incircle]).alts([1]);
			// }
			// var sides = bside.list();

			// var radii = [];
			// for (var incircle = 0; incircle < niter-noffset; incircle++) {
			// 	var ncircle = ncircles[incircle];
			// 	// var rsupport = lgeo(1.0,5.0,0.99,ncircle/2);
			// 	var rsupport = samples(0.05,0.05,100);
			// 	// console.log("rsupport",rsupport);
			// 	rsupport = rsupport.concat(lreverse(rsupport));
			// 	// console.log("after reverse rsupport",rsupport);
				
			// 	// radii = radii.concat(lrandfluctuate(rsupport),0.1);
			// 	radii = radii.concat(rsupport);
			// }

		sides = [1];
		radii = [0.05]


		// console.log("radii ",radii);

		// color: function(lastindex) {return d3.hsl(((lastindex)%(28))/(28)*360.0, 1.0,0.7);},
		// function(lastindex) {return d3.hsl((100.0 + 50.0*lcircular(sides,lastindex+1)), 1.0,0.7);},			   

		var newpattern = new bpatternbaoswitch(sides,
											   radii,
											   newnodes,
											   fdraw);

			// var newpattern = new bpatternparrot(newnodes);

		return newpattern
	}
};



chicharcanvas.prototype.buildpatterns = function() {
	this.patterns = []
	this.quadtree = initquadtree();
	this.iter = 0;
	this.maxiter = 1000000;
	this.lastpatternid = 0;
	this.viewbox0 = this.viewviewbox;

	for (var i = 0; i < this.chichar.strokes.length; i++) {
		var stroke = this.chichar.strokes[i];
		for (var j = 0; j < stroke.points.length; j++) {
			chidrawcircle(this.canvas,stroke.points[j],Color.prototype.black(),0.1);
		}
	}
	for (var i = 0; i < this.chichar.strokes.length; i++) {
		var stroke = this.chichar.strokes[i];
		for (var j = 0; j < stroke.points.length; j++) {	
			var newpattern = this.createpattern(stroke.points[j],(stroke.points.length-j)/stroke.points.length);
			if (newpattern) {
				this.patterns.push(newpattern);
			}
		}
	}
};

chicharcanvas.prototype.iterframe = function() {

	// console.log("iterframe iter",this.iter);

	if (this.iter != undefined)
	{
		if (this.iter < this.maxiter && this.patterns.length > 0) {
			if ((this.iter % 100) == 0) {
				console.log("iter ",this.iter);
			}
			this.lastpatternid += 1;
			lastpattern = lcircular(this.patterns,this.lastpatternid);
			result = lastpattern.iter(this.quadtree,this.canvas,10);

			for (var iresult = 0; iresult < result.length; iresult++) {
				var nnewnode = result[iresult];
				// this.viewbox0 = mergeviewboxes(circleviewbox(nnewnode),this.viewbox0);
			}
			console.log("result length",result.length,"patterns",this.patterns.length)
			if (result.length == 0) {
				this.patterns = lremove(this.patterns,lastpattern);
				this.lastpatternid -= 1;
			}
			console.log("new patterns length",this.patterns.length)
			// this.iter += result.length;
			this.iter += 1;
		}
	
		// var viewviewbox = squareviewbox(expandviewbox(this.viewbox0,3.0));
		
		resetviewbox(this.canvas,this.viewviewbox);
		return relaunchloop(this.iter < this.maxiter,this.iterframe);
	}
	return false;
}