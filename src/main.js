/*
 * This file glues all the separate components together.
 * Angular needs to be globally available.
 */

var MODULE_NAME = 'energimolnet';
var ngModule = angular.module(MODULE_NAME, []);

if (typeof module === 'object') {
  module.exports = MODULE_NAME;
}

ngModule
  .factory('emDateUtil', function() { return require('./date-util'); })
  .factory('emAuth', ['$window', '$http', '$q', 'authConfig', 'apiBaseUrl', require('./auth')])
  .factory('energimolnetAPI', ['$http', '$q', '$rootScope', 'emAuth', 'apiBaseUrl', require('./energimolnet-api')])
  .factory('emResourceFactory', ['energimolnetAPI', require('./resource-factory')])

  .factory('emAccounts', ['emResourceFactory', require('./models/accounts')])
  .factory('emClients', ['emResourceFactory', require('./models/clients')])
  .factory('emConsumptionPreview', ['emResourceFactory', require('./models/consumption-preview')])
  .factory('emConsumptionStats', ['emResourceFactory', require('./models/consumption-stats')])
  .factory('emConsumptions', ['emResourceFactory', 'energimolnetAPI', require('./models/consumptions')])
  .factory('emEdielJobs', ['emResourceFactory', require('./models/ediel-jobs')])
  .factory('emFileJobs', ['emResourceFactory', require('./models/file-jobs')])
  .factory('emFtpConnections', ['emResourceFactory', require('./models/ftp-connections')])
  .factory('emMe', ['emResourceFactory', require('./models/me')])
  .factory('emMeters', ['emResourceFactory', 'energimolnetAPI', require('./models/meters')])
  .factory('emOwners', ['emResourceFactory', require('./models/owners')])
  .factory('emPassword', ['emResourceFactory', require('./models/password')])
  .factory('emRefreshTokens', ['emResourceFactory', require('./models/refreshtokens')])
  .factory('emReports', ['emResourceFactory', require('./models/reports')])
  .factory('emRobotJobs', ['emResourceFactory', require('./models/robot-jobs')])
  .factory('emRobots', ['emResourceFactory', 'energimolnetAPI', require('./models/robots')])
  .factory('emScrapers', ['emResourceFactory', require('./models/scrapers')])
  .factory('emSubaccounts', ['emResourceFactory', require('./models/subaccounts')])
  .factory('emSubscribers', ['emResourceFactory', 'energimolnetAPI', require('./models/subscribers')])
  .factory('emTokens', ['emResourceFactory', require('./models/tokens')])

  .run(['$window', 'emAccounts', 'emClients', 'emConsumptionPreview', 'emConsumptionStats', 'emConsumptions', 'emEdielJobs', 'emFileJobs', 'emFtpConnections', 'emMe', 'emMeters', 'emOwners', 'emPassword', 'emRefreshTokens', 'emReports', 'emRobotJobs', 'emRobots', 'emScrapers', 'emSubaccounts', 'emSubscribers', 'emTokens', 'emDateUtil', 'energimolnetAPI', 'emAuth', require('./debug-util')]);
