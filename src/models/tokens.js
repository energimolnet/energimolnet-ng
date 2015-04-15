module.exports = function(ngModule) {
  ngModule.factory('emTokens', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({}, [], {
        forAccountPath: 'tokens',
        forAccountMethods: ['get', 'save', 'query', 'delete']
      });
    }
  ]);
};
