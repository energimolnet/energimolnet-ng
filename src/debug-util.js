/*
 * This attaches an em object to window that can be used for testing
 * and debugging.
 *
 * The em function is used to log the data or error returned from the
 * promise that the collection models return.
 *
 * E.g.
 *
 *   em(em.Owners.query({name: 'Öresunds'}))
 *
 */

module.exports = function($window,
                          emAccounts,
                          emClients,
                          emComplaints,
                          emCalculatedMetrics,
                          emConsumptionPreview,
                          emConsumptionStats,
                          emConsumptions,
                          emEdielJobs,
                          emFeeds,
                          emFileJobs,
                          emFtpConnections,
                          emMe,
                          emMeters,
                          emMetricModels,
                          emOwners,
                          emPassword,
                          emRefreshTokens,
                          emReports,
                          emRobotJobs,
                          emRobotStats,
                          emRobots,
                          emScrapers,
                          emSubaccounts,
                          emSubscribers,
                          emTokens,
                          emDateUtil,
                          energimolnetAPI,
                          emAuth) {
  function em(func, condensed) {
    func.then(function(res) {
      if (condensed === true) {
        $window.console.log('Response:\n', res);
      } else {
        $window.console.log('Response:\n', JSON.stringify(res, null, 2));
      }
    }, function(err) {
      $window.console.log('Error:\n', err);
    });
  }

  em.Accounts = emAccounts;
  em.Clients = emClients;
  em.Complaints = emComplaints;
  em.CalculatedMetrics = emCalculatedMetrics;
  em.ConsumptionPreview = emConsumptionPreview;
  em.ConsumptionStats = emConsumptionStats;
  em.Consumptions = emConsumptions;
  em.EdielJobs = emEdielJobs;
  em.Feeds = emFeeds;
  em.FileJobs = emFileJobs;
  em.FtpConnections = emFtpConnections;
  em.Me = emMe;
  em.Meters = emMeters;
  em.MetricModels = emMetricModels;
  em.Owners = emOwners;
  em.Password = emPassword;
  em.RefreshTokens = emRefreshTokens;
  em.Reports = emReports;
  em.RobotJobs = emRobotJobs;
  em.RobotStats = emRobotStats;
  em.Robots = emRobots;
  em.Scrapers = emScrapers;
  em.Subaccounts = emSubaccounts;
  em.Subscribers = emSubscribers;
  em.Tokens = emTokens;
  em.DateUtil = emDateUtil;
  em.api = energimolnetAPI;
  em.auth = emAuth;

  $window.em = em;
};
