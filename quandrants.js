//GLOBAL VARIABLES
var ITERATIONS = 512;
var MAX_DEPTH = 5;
var DEBUG_MODE = false;

//The Image data
var g_image = new Image();
var g_imageData; //will be set on g_image.OnLoad

//Canvas used for drawing the actual image
var canvas;
var ctx;
			
//Buffer
var bufferCanvas = document.createElement('canvas');
var buffer = bufferCanvas.getContext('2d');


function quandrants( passed_canvas,cWidth ,cHeight)
{
	//Initialize the drawing canvas and context for main canvas and buffer
	canvas = passed_canvas;
	ctx = canvas.getContext("2d");
	bufferCanvas.width 	= canvas.width;
	bufferCanvas.height = canvas.height;
	
	// Member variables
	var intervalID	= -1;
	var framerate 	= 30; //60
	var isRunning 	= false;

	var boxes = [];
	var root;
	var drawNode;
	var hist;
	
	this.run = function( img )
	{	
		g_image = new Image();
		g_image.onload = function()
		{	
			g_imageData = ctx.getImageData(0,0,cWidth,cHeight);
			console.log( g_imageData);
			isRunning = true;
			
			root = new Box( g_image, {},  0, 0, cWidth, cHeight, 0 );
			drawNode = root;
			boxes.push( root );
			draw();
			intervalID = setInterval( running, 1000/ framerate );				
		}
		g_image.src = img ;
		
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