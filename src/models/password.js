module.exports = function(ngModule) {
  ngModule.factory('emPassword', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/accounts/me/password'}, ['save'], {saveMethod: 'PUT'});
    }
  ]);
};