module.exports = function(ngModule) {
  ngModule.factory('emReports', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({
        default: '/reports',
        post: true
      });
    }
  ]);
};
