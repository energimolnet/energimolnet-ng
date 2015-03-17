module.exports = function(ngModule) {
  ngModule.factory('emAccounts', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/accounts'}, ['get', 'query', 'save', 'delete']);
    }
  ]);
};