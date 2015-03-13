module.exports = function(ngModule) {
  ngModule.factory('emOwners', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/owners'}, ['get', 'query']);
    }
  ]);
};