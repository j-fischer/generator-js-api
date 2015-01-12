(function () { // initializes namepsace if neccessary
  var namespaceString = '{{$API_NAME}}';
  
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';    
        
    for(var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }
})();

{{$API_NAME}} = (function () {
  
  function init() {
    
  }
  
  init();
  
  return {
    /** 
     * This is an API method that does something.
     * @param {object} args
     *   @param {string} args.aParam: this is a parameter for this method
     */
    myFunc: function (args) {
      
    }
  };
})();