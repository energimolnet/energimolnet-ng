module.exports = function(ngModule) {
  ngModule.factory('emClients', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({
        default: '/clients',
        get: true,
        put: true,
        post: true,
        query: true,
        delete: true,
        forAccount: {
          default: 'clients',
          get: true,
          put: true,
          post: true,
          query: true,
          delete: true
        }
      });
    }
  ]);
};
