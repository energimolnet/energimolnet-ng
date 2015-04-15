module.exports = function(ngModule) {
  ngModule.factory('emTokens', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({}, [], {
        forAccountPath: 'subaccounts',
        forAccountMethods: ['get', 'save', 'query', 'delete']
      });
    }
  ]);
};
