function equals(obj1, obj2) {
  for (var prop in obj1) {
    if (obj1[prop] !== obj2[prop] || obj2.hasOwnProperty(prop) === false) {
      return false;
    }
  }

  return true;
}

test("options are set correctly", function() {
    var options = {
        container: 'camera-test',
        audio: false,
        useCanvas: false
    };

  var webcamClient = new WebcamClient(options);

  ok(equals(webcamClient.options, options), "options correctly set");

  options.audio = true
  webcamClient.setOptions(options);

  ok(equals(webcamClient.options, options), "options correctly updated");
});

asyncTest("triggers 'start' event when access permitted (click Allow)", function() {
    var webcamClient = new WebcamClient({ container: 'camera-test' });

  webcamClient.on('start', function() {
    ok(true, "start event triggered");
    start();
    this.stop();
  });

  webcamClient.start();
});

asyncTest("triggers 'snapshot' event when taking a snapshot", function() {
    var webcamClient = new WebcamClient({ container: 'camera-test' });

  webcamClient.on('start', function() {
    this.snapshot();
  });

  webcamClient.on('snapshot', function(snapshot) {
    ok(snapshot.tagName === 'CANVAS', "snapshot event triggered");
    start();
    this.stop();
  });

  webcamClient.start();
});


asyncTest("triggers 'stop' event and successfully cleans up when stopping", function() {
    var webcamClient = new WebcamClient({ container: 'camera-test' });

  webcamClient.on('stop', function() {
    ok(true, "stop event triggered");
    start();
  });

  webcamClient.on('start', function() {
    this.stop();
  });

  webcamClient.start();
});

asyncTest("triggers 'error' event when not supported", function() {
    var webcamClient = new WebcamClient({ container: 'camera-test' });

  // store correct property so we can switch it back after following test
  var origGetUserMedia = navigator.getUserMedia;

  // simulate the lack of functionality
  navigator.getUserMedia = false;

  webcamClient.on('error', function(err) {
    navigator.getUserMedia = origGetUserMedia;
    ok(err === "Browser not supported", "not supported event triggered");
    start();
  });

  webcamClient.start();
});

asyncTest("triggers 'error' event when access denied (click Deny)", function() {
    var webcamClient = new WebcamClient({ container: 'camera-test' });

  webcamClient.on('error', function(err) {
    ok(true, "access denied event triggered");
    start();
  });

  webcamClient.start();
});
