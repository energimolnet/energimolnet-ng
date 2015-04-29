module.exports = function(ngModule) {
  ngModule.factory('emSubaccounts', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({
        forAccount: {
          default: 'subaccounts',
          get: '/accounts',
          put: true,
          post: true,
          query: true,
          delete: '/accounts'
        }
      });
    }
  ]);
};
