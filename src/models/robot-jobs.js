module.exports = function(ngModule) {
  ngModule.factory('emRobotJobs', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/robotjobs'}, ['get', 'query', 'save', 'delete']);
    }
  ]);
};
