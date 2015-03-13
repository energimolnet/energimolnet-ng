module.exports = function(ngModule) {
  ngModule.factory('emUsers', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/users', query: '/accounts/me/users'}, ['get', 'query']);
    }
  ]);
};