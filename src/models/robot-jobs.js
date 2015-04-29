module.exports = function(ngModule) {
  ngModule.factory('emRobotJobs', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({
        default: '/robot_jobs',
        get: true,
        query: true,
        put: true,
        post: true,
        delete: true
      });
    }
  ]);
};
