var RED_ERROR_WEIGHT   = 0.2989;
var GREEN_ERROR_WEIGHT = 0.5870;
var BLUE_ERROR_WEIGHT  = 0.1140;

/**
*	Histogram contructor
**/
function Histogram( image, x, y, w, h )
{
	var COLOR_RANGE = 256;
	var r_offset = 0, g_offset = 1, b_offset = 2, a_offset = 3;

	//the map buffer
	var imgData;

	//Histogram Channels
	var r = [];
	var g = [];
	var b = [];

	buildHist();

	/**
	* Builds the Histogram from the given image data
	**/
	function buildHist()
	{
		//first initialize r, g, and b
		r = newFilledArray( COLOR_RANGE, 0 );
		g = newFilledArray( COLOR_RANGE, 0 );
		b = newFilledArray( COLOR_RANGE, 0 );

		////Fill buffer, and get image data from it
		buffer.drawImage( image,x, y, w, h, x, y, w, h);
		imgData = buffer.getImageData( x, y, w, h );

		//fill them with data
		for( var i = 0, l = imgData.data.length; i < l; i+=4 )
		{
			//add a red color
			var rVal = imgData.data[ i + r_offset ];
			r[rVal] = r[rVal] + 1;

			//add a green color
			var gVal = imgData.data[ i + g_offset ];
			g[gVal] = g[gVal] + 1;

			//add a blue color
			var bVal = imgData.data[ i + b_offset ];
			b[bVal] = b[bVal] + 1;

		}
	}

	/**
	*
	**/
	function newFilledArray(length, val)
	{
		var array = [];
		var i = 0;

		while (i < length)
		{
			array[i++] = val;
		}
		return array;
	}

	/**
	* Returns the weighted average of a set of data of a color channel histogram
	*/
	function weightedAverage( data )
	{
		var total = 0, value = 0, error = 0, i = 0;

		for( i = 0, l = data.length; i < l; i++ )
		{
			total += data[i];
			value += data[i] * i;
		}
		value = value / total;

		for( i = 0, l = data.length; i < l; i++ )
		{
			error += ( data[i] * Math.pow(( value - i ),2));
		}
		error = Math.sqrt( error / total );

		return { value: value, error: error };
	}

	/**
	* The weighted average of colors
	**/
	this.averageColor = function()
	{
		var rColor = weightedAverage( r );
		var gColor = weightedAverage( g );
		var bColor = weightedAverage( b );

		//standard NTSC conversion formula
		var error = rColor.error * RED_ERROR_WEIGHT +
					gColor.error * GREEN_ERROR_WEIGHT +
					bColor.error * BLUE_ERROR_WEIGHT;
					
		var color = {
			r: rColor.value,
			g: gColor.value,
			b: bColor.value,
			e: error
		};

		return color;
	};
}
