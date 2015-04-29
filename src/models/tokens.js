module.exports = function(ngModule) {
  ngModule.factory('emTokens', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({
        forAccount: {
          default: 'tokens',
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
