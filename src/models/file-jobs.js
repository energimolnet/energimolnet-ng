module.exports = function(ngModule) {
  ngModule.factory('emFileJobs', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/filejobs'}, ['get', 'query', 'save', 'delete']);
    }
  ]);
};
