// NOTE: Users will be deprecated and replaced by accounts.
// To get users, query accounts with {role: 'user'}

module.exports = function(ngModule) {
  ngModule.factory('emUsers', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/users', query: '/accounts/me/users'}, ['get', 'query']);
    }
  ]);
};