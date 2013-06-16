test("Synchrnous Test -- Options correctly set", function () {
    var options = {
        container: 'container',
        snapshots: true,
        audio: false
    };

    var camMan = new CamMan(options);

    deepEqual(camMan.options, options, "The options were correctly set");

    options.audio = true
    camMan.setOptions(options);

    deepEqual(camMan.options, options, "The options were correctly updated");
});

asyncTest("Async Test -- Triggers 'start' event (click Allow)", function () {
    var camMan = new CamMan({ container: 'container' });

    camMan.on('start', function () {
        ok(true, "start event triggered");
        start();
        this.stop();
    });

    camMan.start();
});

asyncTest("Async Test -- Triggers 'snapshot' event", function () {
    var camMan = new CamMan({ container: 'container' });

    camMan.on('start', function () {
        this.snapshot();
    });

    camMan.on('snapshot', function (snapshot) {
        ok(snapshot.tagName === 'CANVAS', "snapshot event triggered");
        start();
        this.stop();
    });

    camMan.start();
});


asyncTest("Async Test -- Stops and triggers 'stop' event", function () {
    var camMan = new CamMan({ container: 'container' });

    camMan.on('stop', function () {
        ok(true, "The 'stop' event triggered");
        start();
    });

    camMan.on('start', function () {
        this.stop();
    });

    camMan.start();
});

asyncTest("Async Test -- Triggers 'error' event if unsupported", function () {
    var camMan = new CamMan({ container: 'container' });

    /** Backup and replace getUserMedia implementation for testing */
    var userMediaBackup = navigator.getUserMedia;
    navigator.getUserMedia = false;

    camMan.on('error', function (err) {
        /** Restore getUserMedia implementation and check results */
        navigator.getUserMedia = userMediaBackup;
        ok(err === "Browser not supported", "not supported event triggered");
        start();
    });

    camMan.start();
});

asyncTest("Async Test -- Successfully start/stop w/o container", function () {
    var camMan = new CamMan();

    camMan.on('start', function () {
        ok(true, "The 'start' event was triggered");
        camMan.stop();
    });

    camMan.on('stop', function () {
        start();
    });

    camMan.start();
});

asyncTest("Async Test -- Successfully get a canvas", function () {
    var camMan = new CamMan();

    camMan.on('start', function () {
        var canvas = camMan.getCanvas('container');
        if (canvas) ok(true, "The 'start' event was triggered");
        this.stop();
    });

    camMan.on('stop', function () {
        start();
    });

    camMan.start();
});

asyncTest("Async Test -- Triggers 'error' event (click Deny)", function () {
    var camMan = new CamMan({ container: 'container' });

    camMan.on('error', function (err) {
        ok(true, "The 'error' event triggered");
        start();
    });

    camMan.start();
});