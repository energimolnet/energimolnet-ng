module.exports = function(ngModule) {
  ngModule.factory('emSubaccounts', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({}, [], {
        forAccountPath: 'subaccounts',
        forAccountMethods: ['get', 'save', 'query', 'delete'],
        forAccountPaths: {
          get: '/accounts',
          save: '/accounts',
          delete: '/accounts'
        }
      });
    }
  ]);
};
