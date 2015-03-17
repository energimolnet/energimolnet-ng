/*
 * This file glues all the separate components together.
 * Angular needs to be globally available.
 */ 

(function(angular) {
  var module = angular.module('energimolnet', []);

  require('./resource-factory')(module);
  require('./url')(module);
  require('./energimolnet-api')(module);
  require('./debug-util')(module);
  require('./date-util')(module);

  require('./models/consumption-preview')(module);
  require('./models/consumption-stats')(module);
  require('./models/consumptions')(module);
  require('./models/contracts')(module);
  require('./models/me')(module);
  require('./models/owners')(module);
  require('./models/password')(module);
  require('./models/reports')(module);
  require('./models/robots')(module);
  require('./models/users')(module);
})(angular);