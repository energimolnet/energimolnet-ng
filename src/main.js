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

  require('./models/accounts')(module);
  require('./models/clients')(module);
  require('./models/consumption-preview')(module);
  require('./models/consumption-stats')(module);
  require('./models/consumptions')(module);
  require('./models/ediel-jobs')(module);
  require('./models/file-jobs')(module);
  require('./models/ftp-connections')(module);
  require('./models/me')(module);
  require('./models/meters')(module);
  require('./models/owners')(module);
  require('./models/password')(module);
  require('./models/refreshtokens')(module);
  require('./models/reports')(module);
  require('./models/robot-jobs')(module);
  require('./models/robots')(module);
  require('./models/scrapers')(module);
  require('./models/subaccounts')(module);
  require('./models/subscribers')(module);
  require('./models/tokens')(module);
})(angular);
