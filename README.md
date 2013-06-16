CamMan.js
===========
A JavaScript library for managing and accessing webcam and mic data using the
open WebRTC spec. CamMan.js has no external dependencies and includes shims for
cross browser support exposing a simplified interface and event-based API. 
Originally based on [**`leemachin/say-cheese`**][say-cheese]. CamMan.js has
been  enhanced to support canvas outputs, each of which may be manipulated
separately per frame.

Check out the Photobooth [**example app**][demo] to see what you can do very
easily with CamMan.js. You can also run the [**QUnit tests**][tests] if you so
choose. The minified source code `CamMan.min.js` weighs in at 3.7 KB.

### The Basics

The simplest thing to get your webcam video onto a page.

```html
<html>
  <head>
    <title>Hello CamMan</title>
    <script type="text/javascript" src="CamMan.js"></script>
  </head>
  <body>
    <div id="container"></div>
    <script type="text/javascript">
       var camMan = new CamMan({ container: 'container' });
       camMan.start();
    </script>
  </body>
</html>
```

By default passing in a container id with the constructor options will cause
the source video element to be injected into the container. If you'd rather
have a canvas element, you can wait until the webcam has been initialized and
then get a canvas. CamMan.js exposes an event-based API:

```javascript
camMan.on('start', function () {
	camMan.getCanvas('container', function (canvas) {
        var ctx = canvas.getContext('2d');
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		 // Manipulate array of pixel data -- imgData.data

        ctx.putImageData(imgData)
    });
});
```

Event-Based API
----------------------

```javascript

/** Appends the source video element to the container */
var camMan = new CamMan({container: 'container-id'});

/** Start event called after user allows access and webcam turns on */
camMan.on('start', function() {
   this.snapshot();
});

/** Stop event called after user stop method is called. */
camMan.on('stop', function() {
	// Do something when stopped
});

/** Error event called when user denies access, or when browser unsupported */
camMan.on('error', function(error) {
	console.log(error);
});

/** Called whenever a snapshot is taken, passing in the canvas data */
camMan.on('snapshot', function(canvas) {
	// Do something whenever a snapshot is taken
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
 - [**John Robinson** -- *How You Can Build an HTML Photobooth App*][robinson]
 - [**Cory Gross** -- *Easily Access Webcam with CamMan.js*][gross]

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
[tests]: http://coryg89.github.io/CamMan.js/test
[gross]: http://coryg89.github.io/technical/2013/06/15/easily-access-webcam-with-cammanjs/
[say-cheese]: https://github.com/leemachin/say-cheese
[robinson]: http://www.storminthecastle.com/2013/05/07/how-you-can-build-an-html5-photobooth-app/
[mdn]: https://developer.mozilla.org/en-US/docs/WebRTC/Taking_webcam_photos