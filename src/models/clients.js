module.exports = function(ngModule) {
  ngModule.factory('emClients', [
    'emResourceFactory',
    function(resourceFactory) {
      return {
        forAccount: function(accountId) {
          var path = '/accounts/' + accountId + '/clients';

          return resourceFactory({default: path}, ['query']);
        }
      };
    }
  ]);
};
