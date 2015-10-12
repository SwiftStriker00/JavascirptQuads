 //GLOBAL VARIABLES
var AREA_POWER = 0.25;
var MAX_DIVISIONS = 10;
var MAX_LINE_WIDTH = 4;

DrawMode = {
	BOX:		"Box",
	BOXBORDER: 	"BoxBorder",
	HATCH:		"Hatch",
	HATCHSHADE:	"HatchShaded"
};

/**
*	Box constructor
**/
function Box( image, parent, x, y, w, h, depth )
{
	this.parent = parent;
	this.image = image;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.depth = depth;
	this.hatchWidth =  Math.tan( Math.atan( MAX_LINE_WIDTH / MAX_DEPTH ) )* ( MAX_DEPTH - this.depth);
	this.children = [];
	this.hist = new Histogram( image, x, y, w, h );
	this.setColor( this.hist.averageColor() );
	this.score = -this.error * Math.pow( this.area(), AREA_POWER );
	this.mode = DrawMode.HATCHSHADE;
}

/**
* Determines if there are no children to this node
**/
Box.prototype.isLeaf = function()
{
	if( this.children.length === 0 )
	{
		return true;
	}
	return false;
};

/**
* Gets the children nodes to this box
**/
Box.prototype.getLeafNodes = function()
{
	if( this.children === [] )
	{
		return [ this ];
	}
	else
	{
		return this.children;
	}
};

Box.prototype.getAllLeafNodes = function( currentlist, maxdepth )
{
	if( this.depth >= maxdepth )
	{

	}
	else if( this.isLeaf() )
	{
		currentlist.push( this );
	}
	else
	{
		for( var i = 0; i < this.children.length; i++ )
		{
			currentlist = this.children[i].getAllLeafNodes( currentlist, maxdepth );
		}
	}
	return currentlist;
};

/**
* Gets the children nodes to this box up to a maximum depth given
**/
Box.prototype.getLeafNodes = function( depth )
{
	if( this.depth >= depth )
	{
		return [ this ];
	}
	else if( this.children === [])
	{
		return [ this ];
	}
	else
	{
		return this.children;
	}
};

/**
* Generate children nodes for this box
**/
Box.prototype.divide = function()
{

	var w2 = this.w / 2;
	var h2 = this.h / 2;

	var q1 = new Box(this.image, this, this.x, 	    this.y, 	 w2, h2, this.depth+1 );
	var q2 = new Box(this.image, this, this.x + w2, this.y, 	 w2, h2, this.depth+1 );
	var q3 = new Box(this.image, this, this.x, 	    this.y + h2, w2, h2, this.depth+1 );
	var q4 = new Box(this.image, this, this.x + w2, this.y + h2, w2, h2, this.depth+1 );

	this.children =[ q1, q2, q3, q4 ];
};

/**
* Draw the box's current color and if enabled, a border
**/
Box.prototype.draw = function( ctx )
{
	ctx.fillStyle = this.color;

	switch( this.mode )
	{
		case DrawMode.BOXBORDER:
			ctx.beginPath();
			ctx.lineWidth="0.1";
			ctx.strokeStyle= "black";//this.color;
			ctx.rect( this.x, this.y, this.w, this.h );
			ctx.stroke();
		/* falls through */
		case DrawMode.BOX:
			ctx.fillRect( this.x, this.y, this.w, this.h );
			break;
		case DrawMode.HATCHSHADE:
			ctx.globalAlpha = 0.2;
			ctx.fillRect( this.x, this.y, this.w, this.h );
			ctx.globalAlpha = 1;
		/* falls through */
		case DrawMode.HATCH:
			//determine the number of hatches in a square
			var divisions = MAX_DIVISIONS / (this.depth + 1);
			var vHatches = this.w / divisions;
			var hHatches = this.h / divisions;

			//The deeper we go, the finer our hatches become
			ctx.lineWidth = this.hatchWidth;
			ctx.strokeStyle = this.color;

			ctx.beginPath();


			var i = 0;
			for( i = 0; i < divisions; i++ )
			{
				//Verticle hatches
				ctx.moveTo(this.x+ i*vHatches, this.y);
				ctx.lineTo(this.x+ i*vHatches, this.y+ this.h);

				//Horizontal hatches
				ctx.moveTo(this.x, this.y+ i*hHatches);
				ctx.lineTo(this.x + this.w, this.y+ i*hHatches);

			}
			ctx.stroke();

			for( i = 0; i < divisions; i++ )
			{
				ctx.beginPath();
				ctx.stroke();
			}
			break;
	}

};

/**
* Sets the color and error of the box for the given Color c
**/
Box.prototype.setColor = function( c )
{
	this.color = "rgb("+Math.floor(c.r)+","+Math.floor(c.g)+","+Math.floor(c.b)+")";
	this.error = c.e;
};

/**
* returns the area of the box
**/
Box.prototype.area = function()
{
	return this.w * this.h;
};
