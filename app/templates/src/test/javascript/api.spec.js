describe('My API', function(){

  var _mock;

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
      JsMock.watch(function () {
        _mock = JsMock.mock("aMock");
      });
    });
    afterEach(function () {
      JsMock.assertWatched();
    });

    /*
     * TESTS
     */
    it("should do something", function () {
      <%= apiName %>.myFunc();
    });
  });
});