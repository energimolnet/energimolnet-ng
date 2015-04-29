module.exports = function(ngModule) {
  ngModule.factory('emFileJobs', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({
        default: '/file_jobs',
        get: true,
        query: true,
        put: true,
        save: true,
        delete: true
      });
    }
  ]);
};
