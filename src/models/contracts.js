// Legacy support for /contracts
module.exports = function(ngModule) {
  ngModule.factory('emContracts', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({
        default: '/contracts',
        query: '/accounts/me/contracts'
      }, ['get', 'query', 'save', 'delete']);
    }
  ]);
};

