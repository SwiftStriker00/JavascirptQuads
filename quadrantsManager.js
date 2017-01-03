var quads;

var canvas = document.getElementById("canvas");
canvas.oncontextmenu = function (e) 
{
	e.preventDefault();
};

var playButton = document.getElementById("playButton");
var pauseButton = document.getElementById("pauseButton");
var stopButton = document.getElementById("stopButton");
var resetButton = document.getElementById("resetButton");

var refpix = document.getElementById( 'refpix' );
var shaderselect = document.getElementById( 'shaderSelect' );

function handleFileSelect(evt )
{
	if( quads )
		quads.stop();
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) 
	{
	  // Great success! All the File APIs are supported.
		var file = evt.target.files[0];
		console.log( file );
		
		if( file.type.match( "image.*" ) )
		{
			var reader = new FileReader();
			
			reader.onload = function() {
				var dataURL = reader.result;
				refpix.onload = function()
				{
					console.log( "w:h", refpix.width, refpix.height);
					loadAll();
				}
				refpix.src = dataURL;
			}
			reader.readAsDataURL( file );
		}
	
	
	} 
	else 
	{
	  alert('The File APIs are not fully supported in this browser.');
	}	
}
document.getElementById( "fileButton" ).addEventListener( 'change', handleFileSelect, false );

function updateCanvasWithImage()
{
	canvas.style.width = refpix.width;
	canvas.width = refpix.width;
	canvas.style.height = refpix.height;
	canvas.height = refpix.height;
}

function loadAll()
{
	updateCanvasWithImage();
	quads = new quandrants( canvas );
	quads.initialize( refpix, shaderselect.value ); //fb.jpg
};

function reset()
{
	if( quads )
	{
		quads.stop();
		updateCanvasWithImage();
		quads.initialize( refpix, shaderselect.value );
	}
}

function play()
{
	console.log( "Program Started");
	if( ITERATIONS == 0 )
	{
		ITERATIONS += 1000;
	}
	quads.play();

};

function stop()
{
	quads.stop();
	console.log( "Program Halted");
};

function step()
{
	quads.step();
	console.log( "Program Stepped");
};

function create()
{
	if( quads) 
	{
		buttons.style.display = 'none';
		quads.stop();
	}

	var dataUrl = canvas.toDataURL();
	var img = document.getElementById('refpix');
	img.src = dataUrl;
	canvas.style.display = 'none';
	saveMe.style.display = "block";
	img.style.display = "block";
};

