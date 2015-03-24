module.exports = function(ngModule) {
  ngModule.factory('emContracts', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/contracts'}, ['get', 'query', 'save', 'delete', 'batchUpdate']);
    }
  ]);
};
