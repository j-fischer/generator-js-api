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

(function () {
  
  function init() {
    
  }
  
  init();
  
 /** 
  * This is a module. 
  *
  * @exports {{$MODULE_NAME}}
  */
  var API = {
    /** 
     * This is an API method that does something.
     * @param {object} args
     *   @param {string} args.aParam: this is a parameter for this method
     *
     * @module {{$MODULE_NAME}}
     */
    myFunc: function (args) {
      
    }
  };
  
  if ( typeof define === "function" && define.amd ) {
  	define("{{$MODULE_NAME}}", [], function() {
  		return API;
  	});
  }

  window.{{$API_NAME}} = API;
})();