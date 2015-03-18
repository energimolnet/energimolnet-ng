module.exports = function(ngModule) {
  ngModule.factory('emSubaccounts', [
    'emResourceFactory',
    function(resourceFactory) {
      return {
        forAccount: function(accountId) {
          var path = '/accounts/' + accountId + '/subaccounts';

          return resourceFactory({default: path}, ['get', 'save', 'query', 'delete']);
        }
      }
    }
  ]);
};