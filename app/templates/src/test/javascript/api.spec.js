describe('NB Messaging API', function(){
  
  var _clock;
  
  /*
   * HELPER FUNCTIONS
   */
  function doSomething() {
    // do something
  }
  
  /*
   * TESTS
   */
  describe('myFunc', function(){
    
    beforeEach(function () {
      _clock = sinon.useFakeTimers();
    });
    afterEach(function () {
			_clock.tick(_DEFAULT_TIMEOUT); // cleans up all registered callbacks
      _clock.restore();
    });  
		
		/*
		 * TESTS
		 */
    it("should do something", function () {
      
		});
  });
});