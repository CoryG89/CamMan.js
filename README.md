CamMan.js
===========
A JavaScript library and event-based API for managing and accessing the webcam
and microphone using WebRTC. CamMan.js has no external dependencies and relies
only on the browser to work. Originally based on
[**`leemachin/say-cheese`**][say-cheese]. Enhanced to support multiple
canvas video output. Manipulation can be applied differently on multiple
canvases rendering the same source video.

Check out the [**example demo**][demo] to see what you can do very easily.

Setup
-----
Simply include the script, and you're ready to roll. You'll need to host
it for this to work, so don't be surprised if you're not running it from
`localhost`.
	
```html
<html>
<head>
  <title>Example</title>
  <script src='/assets/js/CamMan.js'></script>
</head>
<body>
	<div id='containerID'></div>
</body>
</html>
```

Usage
-----

```javascript

/** Appends the source video element to the container */
var camMan = new CamMan({container: 'container-id'});

/** Start event called after user allows access and webcam turns on */
camMan.on('start', function() {
   this.snapshot();
});

/** Stop event called after user stop method is called. */
camMan.on('stop', function() {
	;
});

/** Error event called when user denies access, or when browser unsupported */
camMan.on('error', function(error) {
	console.log(error);
});

/** Called whenever a snapshot is taken, passing in the canvas data */
camMan.on('snapshot', function(canvas) {
	;
});

camMan.start();
```

Using Canvas Video Outputs
------------------------------
```javascript

/** Create w/ default options, no element initially inserted into DOM */
var camMan = new CamMan();

camMan.on('start', function() {

    camMan.getCanvas('first-container-id', function (canvas) {
		var context = canvas.getContext('2d');
		var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
		
		/** Do something w/ your image data from the first canvas */

		context.putImageData(imgData, 0, 0);
    });

    camMan.getCanvas('second-container-id', function (canvas) {
		var context = canvas.getContext('2d');
		var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
		
		/** Do something different w/ image data from second canvas */

		context.putImageData(imgData, 0, 0);
    });
});

camMan.start();
```

Taking snapshots
----------------

You can take a snapshot at any time after initialisation, by calling the
`snapshot()` method.

```javascript
camMan.on('start', function () {

	camMan.on('snapshot', function(canvas) {
	  // do something with the snapshot
	});

	camMan.snapshot();
});
```

If you need to change the size of the snapshot created, pass in the new width 
and height as arguments. The default width and height are the full size video.
These default sizes depend on the browser you are running. Chrome and Opera
are typically `640x400`, and [**according to MDN**][mdn] apparently Firefox
Nightly uses `352x258`. Safari and IE do not have support.

```javascript
var width = 640, height = 480;
camMan.snapshot(width, height);
```

If snapshots are disabled, the `snapshot()` method will not do anything.

Audio Support
-----------------------

Audio support is currently restricted only to Google Chrome. Support should
be in place as soon as other browsers implement audio support. The option for
audio defaults to `false`, to enable it you must explicitly pass in `true`.

```javascript
var camMan = new CamMan({
    container: 'container-id',
    audio: true 
});
```

Tests
-----

Some basic tests cover the callback functionality. They were written
to be run in a browser that supports the `getUserMedia` API. Due to
the nature of that API, there is no automation for allowing or denying
the request, so it has to be done manually for each one.

Compatibility
-------------

Currently supported in

- Firefox
- Google Chrome
- Opera

Resources
-----------
 - [**MDN - WebRTC -- Taking Webcam Photos**][mdn]
 - [**John Robinson -- How You Can Build an HTML Photobooth App**][robinson]

License
-------

Copyright &copy; 2013, Cory Gross
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list
of conditions and the following disclaimer. Redistributions in binary form must
reproduce the above copyright notice, this list of conditions and the following
disclaimer in the documentation and/or other materials provided with the
distribution. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
OF SUCH DAMAGE.


[demo]: http://coryg89.github.io/CamMan.js/example
[say-cheese]: https://github.com/leemachin/say-cheese
[robinson]: http://www.storminthecastle.com/2013/05/07/how-you-can-build-an-html5-photobooth-app/
[mdn]: https://developer.mozilla.org/en-US/docs/WebRTC/Taking_webcam_photos