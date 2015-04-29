module.exports = function(ngModule) {
  ngModule.factory('emSubscribers', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({
        forAccount: {
          default: 'meter_subscribers',
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
