module.exports = function(ngModule) {
  ngModule.factory('emRefreshTokens', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({
        default: '/refreshtokens',
        query: true
      });
    }
  ]);
};
