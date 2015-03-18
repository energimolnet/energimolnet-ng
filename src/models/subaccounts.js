module.exports = function(ngModule) {
  ngModule.factory('emSubaccounts', [
    'emResourceFactory',
    function(resourceFactory) {
      var Subaccounts = resourceFactory({default: '/accounts'}, ['get', 'query', 'save', 'delete']);

      Subaccounts.forAccount = function(accountId) {
        this.queryPath = this.getPath = '/accounts/' + accountId + '/subaccounts';

        return this;
      }
    }
  ]);
};