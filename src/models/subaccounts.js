module.exports = function(ngModule) {
  ngModule.factory('emSubaccounts', [
    'emResourceFactory',
    function(resourceFactory) {
      var Subaccounts = resourceFactory({default: '/accounts'}, ['get', 'query', 'save', 'delete']);

      Subaccounts.forAccount = function(accountId) {
        var path = '/accounts/' + accountId + '/subaccounts';
        
        return resourceFactory({
          default: '/accounts',
          get: path,
          query: path
        });
      }
    }
  ]);
};