module.exports = function(ngModule) {
  ngModule.factory('emEdielJobs', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/ediel_jobs'}, ['get', 'query', 'save', 'delete']);
    }
  ]);
};
