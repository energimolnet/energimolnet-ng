module.exports = function(ngModule) {
  ngModule.factory('emRobots', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/robots'}, ['get', 'query', 'save', 'delete']);
    }
  ]);
};