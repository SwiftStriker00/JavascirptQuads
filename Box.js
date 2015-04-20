//GLOBAL VARIABLES

var drawLines = false;


function Box( image, parent, x, y, w, h, depth )
{
	this.parent = parent;
	this.image = image;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.depth = depth;	
	this.children = [];
	this.hist = new Histogram( image, x, y, w, h );		
	this.setColor( this.hist.averageColor() );
};

/**
* Determines if there are no children to this node
**/
Box.prototype.isLeaf = function()
{
	if( this.children.length === 0 )
		return true;
	return false;
};

/**
* Gets the children nodes to this box
**/
Box.prototype.getLeafNodes = function()
{
	if( this.children === [] )
		return [ this ];
	else
		return this.children;
};

Box.prototype.getAllLeafNodes = function( currentlist, maxdepth )
{
	if( this.depth >= maxdepth )
	{
		
	}else if( this.isLeaf() )
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
}

/**
* Gets the children nodes to this box up to a maximum depth given
**/
Box.prototype.getLeafNodes = function( depth )
{
	if( this.depth >= depth )
	{
		//this.error = 0;
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
}

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
	ctx.fillRect( this.x, this.y, this.w, this.h );	

	if( drawLines )
	{
		ctx.beginPath();
		ctx.lineWidth="1";
		ctx.strokeStyle= "black";
		ctx.rect( this.x, this.y, this.w, this.h );
		ctx.stroke();
	}
	
	//Debug code, remove
	if( DEBUG_MODE )
	{
		ctx.stroke();
		ctx.fillStyle = "#000";
		ctx.fillText(Math.floor(this.error), this.x+5, this.y+15 );
	}
};

/**
* Sets the color and error of the box for the given Color c
**/
Box.prototype.setColor = function( c )
{
	this.color = "rgb("+Math.floor(c.r)+","+Math.floor(c.g)+","+Math.floor(c.b)+")";
	this.error = c.e;
}

/**
* returns the area of the box
**/
Box.prototype.area = function()
{
	return this.w * this.h;
}