module.exports = function(ngModule) {
  ngModule.factory('emAccounts', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({
        default: '/accounts',
        get: true,
        query: true,
        put: true,
        post: true,
        delete: true
      });
    }
  ]);
};
