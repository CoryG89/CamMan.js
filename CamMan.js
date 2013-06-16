var CamMan = (function () {

    /** Shim for vendor prefixed versions of getUserMedia */
    navigator.getUserMedia = (function () {
        return navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia || false;
    })();

    /** Shim for vendor prefixed versions of requestAnimationFrame */
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame    || 
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    /** Shim for vendor prefixed versions of window.URL */
    window.URL = (function () {
        return window.URL || window.webkitURL || false;
    })();

    /** Construct a new CamMan object */
    var CamMan = function CamMan(options) {
        this.events = {};
        this.snapshots = [];
        this.canvasStorage = [];
        this.video = null;
        this.stream = null;
        this.options = {
            audio: false,
            container: null
        };
        this.setOptions(options);
        return this;
    };

    /** Create a canvas element for video output */
    CamMan.prototype.createCanvas = function createCanvas(callback) {
        var canvas = null;
        var width = this.video.videoWidth;
        var height = this.video.videoHeight;

        if (width && height) {
            canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            var canvasData = {
                canvas: canvas,
                context: canvas.getContext('2d'),
                onFrame: callback
            };

            if (this.canvasStorage.length === 0) this.updateCanvas();
            this.canvasStorage.push(canvasData);
            return canvas;
        }
        return canvas;
    };

    /** Inject a canvas element with video output into a container element */
    CamMan.prototype.getCanvas = function getCanvas(container, callback) {
        var element = document.querySelector('#' + container);
        return element.appendChild(this.createCanvas(callback));
    };

    /** Animation loop for the canvas video output */
    CamMan.prototype.updateCanvas = function updateCanvas() {
        for (var i = 0; i < this.canvasStorage.length; i++) {
            var canvasData = this.canvasStorage[i];
            var canvas = canvasData.canvas;
            var context = canvasData.context;
            var callback = canvasData.onFrame;
            context.drawImage(this.video, 0, 0, canvas.width, canvas.height);
            if (callback) (callback.bind(this))(canvas);
        }
        requestAnimationFrame(this.updateCanvas.bind(this));
    };

    /** Bind a handler to a particular event */
    CamMan.prototype.on = function on(event, handler) {
        if (!this.events.hasOwnProperty(event)) 
            this.events[event] = [];
        this.events[event].push(handler);
    };

    /** Unbind a handler from a particular event */
    CamMan.prototype.off = function off(event, handler) {
        this.events = this.events[event].filter(function (h) {
            if (h !== handler) return h;
        });
    };

    /** Trigger an event passing it the given data object */
    CamMan.prototype.trigger = function trigger(event, data) {
        if (!this.events.hasOwnProperty(event)) return false;

        this.events[event].forEach(function (handler) {
            handler.call(this, data);
        }.bind(this));
    };

    /** Set the configurable options for the client */
    CamMan.prototype.setOptions = function setOptions(options) {
        for (var option in options)
            this.options[option] = options[option];
    };

    /** Return the stream, use window.URL if available */
    CamMan.prototype.getStreamURL = function getStreamURL() {
        if (window.URL && window.URL.createObjectURL)
            return window.URL.createObjectURL(this.stream);
        else
            return this.stream;
    };

    /** Create video element used to receive video from webcam via WebRTC */
    CamMan.prototype.createVideo = function createVideo() {
        var width = 320;
        var height = 0;
        var streaming = false;

        var video = document.createElement('video');

        video.addEventListener('canplay', function () {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);
                video.style.width = width;
                video.style.height = height;
                streaming = true;
                return this.trigger('start');
            }
        }.bind(this), false);

        if (navigator.mozGetUserMedia)
            video.mozSrcObject = this.stream;
        else
            video.src = this.getStreamURL();

        video.play();

        return video;
    };

    /** Take a snapshot, draw it on a canvas element, return it in event  */
    CamMan.prototype.snapshot = function snapshot(width, height) {
        width = width || this.video.videoWidth;
        height = height || this.video.videoHeight;

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        context.drawImage(this.video, 0, 0, width, height);

        this.snapshots.push(canvas);
        this.trigger('snapshot', canvas);
        context = null;
        return canvas;
    };

    /** Start the client, handle both failure and success scenarios */
    CamMan.prototype.start = function start() {
        if (!navigator.getUserMedia) {
            this.trigger('error', 'Browser not supported');
            return false;
        }

        var success = function success(stream) {
            this.stream = stream;
            this.video = this.createVideo();
            var container = this.options.container;
            if (typeof container === 'string') {
                var element = document.querySelector('#' + container);
                element.appendChild(this.video);
            }
        }.bind(this);

        var error = function error(err) {
            this.trigger('error', err);
        }.bind(this);

        var options = { video: true, audio: this.options.audio };

        return navigator.getUserMedia(options, success, error);
    };

    /** Stop the client */
    CamMan.prototype.stop = function stop() {
        this.stream.stop();

        if (window.URL && window.URL.revokeObjectURL) {
            window.URL.revokeObjectURL(this.video.src);
        }

        this.canvasStorage.length = 0;
        return this.trigger('stop');
    };

    return CamMan;
})();
