//GLOBAL VARIABLES
var ITERATIONS = 100;
var MAX_DEPTH = 6;
var image = new Image();
	
function quandrants(canvas,cWidth ,cHeight)
{
	ctx = canvas.getContext('2d');
	
	//the map buffer
	var bufferCanvas = document.createElement('canvas');
	bufferCanvas.width = cWidth;
	bufferCanvas.height = cHeight;
	var buffer = bufferCanvas.getContext('2d');
	
	//private var
	var intervalID	= -1;
	var framerate 	= 30; //60
	var isRunning 	= false;

	var boxes = [];
	var root;
	var drawNode;
	var hist;
		
	//public var
	this.canvasWidth	= cWidth;
	this.canvasHeight 	= cHeight;
	
	this.run = function( img )
	{	
		image = new Image();
		image.onload = function()
		{		
			isRunning = true;
			
			root = new Box( image, {},  0, 0, cWidth, cHeight, 0 );
			drawNode = root;
			boxes.push( root );
			draw();
			intervalID = setInterval( running, 1000/ framerate );				
		}
		image.src = img ;
		
	}
	
	/**
	* Stops the execution of code
	*/
	this.stop = function()
	{
		clearInterval(intervalID);
		isRunning = false;
	}
	
	/**
	*	Basic game loop will keep iterating until flagged to stop
	**/
	function running()
	{
		if( isRunning && ITERATIONS > 0 )
		{
			update();
			draw();	
		}	
	}
	
	/**
	*	A compareTo function to sort Box's by their error
	**/
	function errorCompareTo( a, b )
	{
		if( a.error < b.error )
		{
			return -1;
		}
		if( a.error > b.error )
		{
			return 1;
		}
		return 0;
	};
	
	/**
	*	Game loop update function
	**/
	function update()
	{
		var index =  -1;
		var largestError = 0;
		
		var leaves = root.getAllLeafNodes( [], MAX_DEPTH );
		leaves.sort( errorCompareTo );
		console.log( leaves );
		var last = leaves[leaves.length-1];
		last.divide();
		drawNode = last;
		boxes = leaves;
		
		/*
		for( var i = 0, boxlen = boxes.length; i < boxlen; i++ )
		{
			if( boxes[i].error >= largestError && boxes[i].depth < MAX_DEPTH )
			{
				index = i;
				largestError = boxes[i].error;
				if( largestError < 10 )
				{
					index = -1;
				}
			}
			
		}
			
		if( index !== -1 )
		{
			boxes[index].divide();
			var children = boxes[index].getLeafNodes( MAX_DEPTH );
			boxes.splice( index, 1 );
			for( i = 0, l = children.length; i < l; i++ )
			{
				boxes.splice( index, 0, children[i] );
			}
			////divide and add the children
			//boxes[index].divide();
			//var children = boxes[index].getLeafNodes( MAX_DEPTH );
			//var args = [index,1].concat(boxes[index].getLeafNodes( MAX_DEPTH ));			
			//Array.prototype.splice.apply(boxes, args);
			//
		}
		*/
		ITERATIONS -= 1;		
	};
	
	function getBoxWithLargestError( box )
	{
		console.log( 'box error: ' + box.error + ' depth: ' + box.depth );
		if( box.isLeaf() || box.depth >= MAX_DEPTH )
		{			
			return box;
		}
		else
		{
			var children = box.getLeafNodes();
			children.sort( Box.errorCompareT );
			var largestChild = children[children.length-1];
			//var largestChild = Math.max.apply( Math, box.getLeafNodes().map(function(b){ return b.error;}));			
			return getBoxWithLargestError( largestChild );
		}
	}
	
	
	/**
	*	Game loop draw function
	**/
	function draw()
	{
		/* Since we are overlaying with sub sections, we don't actually need to clear base images
		ctx.fillStyle = "#fff";
		ctx.clearRect(0,0,cWidth,cHeight);*/
		
		drawNode.draw(ctx);
		for( var i = 0; i < drawNode.children.length; i++ )
		{
			drawNode.children[i].draw(ctx);
		}
		/*
		for( var i = 0; i < boxes.length; i++ )
		{
			boxes[i].draw(ctx);
		}*/
		
	}
	
	/**
	*	Gets the average color of a area
	**/
	function averageColorOfRegion( x, y, w, h )
	{
		var imgData = buffer.getImageData( x, y, w, h );
		var total = imgData.data.length;
		var R = 0, G = 0, B = 0;
		
		//Manipulate the current section
		for( var i = 0; i < total; i+= 4 )
		{
			//Index of RGBA
			var r = i + 0, 
				g = i + 1, 
				b = i + 2, 
				a = i + 3;
			
			R = R + imgData.data[r];
			G = G + imgData.data[g];
			B = B + imgData.data[b];			
		}
		return {
			r:Math.floor(R/total),
			g:Math.floor(G/total),
			b:Math.floor(B/total)
		};		
	}	
}