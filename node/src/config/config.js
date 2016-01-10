(function(){
  /* jshint quotmark:double */
  "use strict";

  module.exports = function() {
    var envs = {
      "development": {
        "env": "development",
      },
      "staging": {
        "env": "staging",
      },
      "production": {
        "env": "production",
      }
    };

    return envs[process.env.NODE_ENV];
  };
})();

