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

module.exports = function(ngModule) {
  ngModule.run([
    '$window',
    'emAccounts',
    'emClients',
    'emConsumptionPreview',
    'emConsumptionStats',
    'emConsumptions',
    'emContracts',
    'emMe',
    'emOwners',
    'emPassword',
    'emRefreshTokens',
    'emReports',
    'emRobots',
    'emSubaccounts',
    'emUsers',
    'emDateUtil',
    'energimolnetAPI',
    function($window,
      Accounts,
      Clients,
      ConsumptionPreview, 
      ConsumptionStats,
      Consumptions,
      Contracts,
      Me,
      Owners,
      Password,
      RefreshTokens,
      Reports,
      Robots,
      Subaccounts,
      Users,
      DateUtil,
      energimolnetAPI) {

        function em(func, condensed) {
          func.then(function(res) {
            if (condensed == true) {
              $window.console.log('Response:\n', res);
            } else {
              $window.console.log('Response:\n', JSON.stringify(res, null, 2));
            }
          }, function(err) {
            $window.console.log('Error:\n', err);
          });
        }

        em.Accounts = Accounts;
        em.Clients = Clients;
        em.ConsumptionPreview = ConsumptionPreview;
        em.ConsumptionStats = ConsumptionStats;
        em.Consumptions = Consumptions;
        em.Contracts = Contracts;
        em.Me = Me;
        em.Owners = Owners;
        em.Password = Password;
        em.RefreshTokens = RefreshTokens;
        em.Reports = Reports;
        em.Robots = Robots;
        em.Subaccounts = Subaccounts;
        em.Users = Users;
        em.DateUtil = DateUtil;
        em.api = energimolnetAPI;

        $window.em = em;
    }
  ]);
};
