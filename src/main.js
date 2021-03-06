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
  .factory('emApps', ['emResourceFactory', require('./models/apps')])
  .factory('emCalculatedMetrics', ['emResourceFactory', require('./models/calculated-metrics')])
  .factory('emClients', ['emResourceFactory', require('./models/clients')])
  .factory('emComplaints', ['emResourceFactory', require('./models/complaints')])
  .factory('emConsumptionStats', ['emResourceFactory', require('./models/consumption-stats')])
  .factory('emConsumptions', ['emResourceFactory', 'energimolnetAPI', require('./models/consumptions')])
  .factory('emEdielJobs', ['emResourceFactory', require('./models/ediel-jobs')])
  .factory('emFeeds', ['emResourceFactory', require('./models/feeds')])
  .factory('emFileJobs', ['emResourceFactory', require('./models/file-jobs')])
  .factory('emFtpConnections', ['emResourceFactory', require('./models/ftp-connections')])
  .factory('emInvitations', ['emResourceFactory', require('./models/invitations')])
  .factory('emMe', ['emResourceFactory', require('./models/me')])
  .factory('emMeters', ['emResourceFactory', 'energimolnetAPI', require('./models/meters')])
  .factory('emMeterStats', ['emResourceFactory', require('./models/meter-stats')])
  .factory('emMetricModels', ['emResourceFactory', require('./models/metric-models')])
  .factory('emOwners', ['emResourceFactory', require('./models/owners')])
  .factory('emPassword', ['emResourceFactory', require('./models/password')])
  .factory('emRefreshTokens', ['emResourceFactory', require('./models/refreshtokens')])
  .factory('emReports', ['emResourceFactory', require('./models/reports')])
  .factory('emRobotJobs', ['emResourceFactory', require('./models/robot-jobs')])
  .factory('emRobotStats', ['emResourceFactory', require('./models/robot-stats')])
  .factory('emRobots', ['emResourceFactory', 'energimolnetAPI', require('./models/robots')])
  .factory('emScrapers', ['emResourceFactory', require('./models/scrapers')])
  .factory('emSubaccounts', ['emResourceFactory', require('./models/subaccounts')])
  .factory('emSubscribers', ['emResourceFactory', 'energimolnetAPI', require('./models/subscribers')])
  .factory('emTokens', ['emResourceFactory', require('./models/tokens')])

  .run(['$window', 'emAccounts', 'emApps', 'emClients', 'emComplaints', 'emCalculatedMetrics', 'emConsumptionStats', 'emConsumptions', 'emEdielJobs', 'emFeeds', 'emFileJobs', 'emFtpConnections', 'emInvitations', 'emMe', 'emMeters', 'emMeterStats', 'emMetricModels', 'emOwners', 'emPassword', 'emRefreshTokens', 'emReports', 'emRobotJobs', 'emRobotStats', 'emRobots', 'emScrapers', 'emSubaccounts', 'emSubscribers', 'emTokens', 'emDateUtil', 'energimolnetAPI', 'emAuth', require('./debug-util')]);
