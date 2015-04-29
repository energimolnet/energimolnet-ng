module.exports = function(ngModule) {
  ngModule.factory('emEdielJobs', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({
        default: '/ediel_jobs',
        get: true,
        query: true,
        put: true,
        post: true,
        delete: true
      });
    }
  ]);
};
