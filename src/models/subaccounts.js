module.exports = function(ngModule) {
  ngModule.factory('emSubaccounts', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({}, [], {
        forAccountPath: 'subaccounts',
        forAccountMethods: ['get', 'save', 'query', 'delete']
      });
    }
  ]);
};
