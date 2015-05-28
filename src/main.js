/*
 * This file glues all the separate components together.
 * Angular needs to be globally available.
 */

var MODULE_NAME = 'energimolnet';
var module = angular.module(MODULE_NAME, []);

if (typeof module === 'object') {
  module.exports = MODULE_NAME;
}

module
  .factory('emDateUtil', function() { return require('./date-util'); })
  .factory('energimolnetAPI', ['$http', '$window', '$q', 'apiBaseUrl', require('./energimolnet-api')])
  .factory('emResourceFactory', ['energimolnetAPI', require('./resource-factory')])

  .factory('emAccounts', require('./models/accounts'))
  .factory('emClients', require('./models/clients'))
  .factory('emConsumptionPreview', require('./models/consumption-preview'))
  .factory('emConsumptionStats', require('./models/consumption-stats'))
  .factory('emConsumptions', require('./models/consumptions'))
  .factory('emEdielJobs', require('./models/ediel-jobs'))
  .factory('emFileJobs', require('./models/file-jobs'))
  .factory('emFtpConnections', require('./models/ftp-connections'))
  .factory('emMe', require('./models/me'))
  .factory('emMeters', require('./models/meters'))
  .factory('emOwners', require('./models/owners'))
  .factory('emPassword', require('./models/password'))
  .factory('emRefreshTokens', require('./models/refreshtokens'))
  .factory('emReports', require('./models/reports'))
  .factory('emRobotJobs', require('./models/robot-jobs'))
  .factory('emRobots', require('./models/robots'))
  .factory('emScrapers', require('./models/scrapers'))
  .factory('emSubaccounts', require('./models/subaccounts'))
  .factory('emSubscribers', require('./models/subscribers'))
  .factory('emTokens', require('./models/tokens'))

  .run(require('./debug-util'));
