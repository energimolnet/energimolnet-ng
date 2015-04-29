module.exports = function(ngModule) {
  ngModule.factory('emSubscribers', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({}, [], {
        forAccountPath: 'meter_subscribers',
        forAccountMethods: ['get', 'save', 'query', 'delete']
      });
    }
  ]);
};
