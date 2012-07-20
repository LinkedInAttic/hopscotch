var assert = require('assert'),
    hopscotch = require('../hopscotch');

describe('HopscotchManager', function() {
  describe('#getInstance()', function() {
    it('should return non-null singleton instance of hopscotch', function() {
      var hsManager = hopscotch.hopscotchManager,
          hsInstance = hsManager.getInstance();
      assert.notEqual(hsInstance, null);
    });

    it('should create at most one instance of hopscotch', function() {
      var hsManager = hopscotch.hopscotchManager,
          hsInstance1 = hsManager.getInstance(),
          hsInstance2 = hsManager.getInstance();
      assert.equal(hsInstance1, hsInstance2);
    });
  });
});

/*
describe('Hopscotch', function() {
  var hsInstance = hopscotch
  describe('loadTours', function() {
    
  });
});
*/
