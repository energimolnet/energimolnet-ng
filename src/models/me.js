module.exports = function(ngModule) {
  ngModule.factory('emMe', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({
        default: '/accounts/me',
        get: true,
        put: true
      });
    }
  ]);
};
