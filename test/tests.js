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

  var camMan = new CamMan(options);

  ok(equals(camMan.options, options), "options correctly set");

  options.audio = true
  camMan.setOptions(options);

  ok(equals(camMan.options, options), "options correctly updated");
});

asyncTest("triggers 'start' event when access permitted (click Allow)", function() {
    var camMan = new CamMan({ container: 'camera-test' });

  camMan.on('start', function() {
    ok(true, "start event triggered");
    start();
    this.stop();
  });

  camMan.start();
});

asyncTest("triggers 'snapshot' event when taking a snapshot", function() {
    var camMan = new CamMan({ container: 'camera-test' });

  camMan.on('start', function() {
    this.snapshot();
  });

  camMan.on('snapshot', function(snapshot) {
    ok(snapshot.tagName === 'CANVAS', "snapshot event triggered");
    start();
    this.stop();
  });

  camMan.start();
});


asyncTest("triggers 'stop' event and successfully cleans up when stopping", function() {
    var camMan = new CamMan({ container: 'camera-test' });

  camMan.on('stop', function() {
    ok(true, "stop event triggered");
    start();
  });

  camMan.on('start', function() {
    this.stop();
  });

  camMan.start();
});

asyncTest("triggers 'error' event when not supported", function() {
    var camMan = new CamMan({ container: 'camera-test' });

  // store correct property so we can switch it back after following test
  var origGetUserMedia = navigator.getUserMedia;

  // simulate the lack of functionality
  navigator.getUserMedia = false;

  camMan.on('error', function(err) {
    navigator.getUserMedia = origGetUserMedia;
    ok(err === "Browser not supported", "not supported event triggered");
    start();
  });

  camMan.start();
});

asyncTest("triggers 'error' event when access denied (click Deny)", function() {
    var camMan = new CamMan({ container: 'camera-test' });

  camMan.on('error', function(err) {
    ok(true, "access denied event triggered");
    start();
  });

  camMan.start();
});
