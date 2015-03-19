module.exports = function(ngModule) {
  ngModule.factory('emRobots', [
    'emResourceFactory',
    'emUrl',
    'energimolnetAPI',
    function(resourceFactory, Url, Api) {
      var Robots =  resourceFactory({default: '/robots'}, ['get', 'query', 'save', 'delete']);

      Robots.run = function(robotId) {
        Api.request({
          url: Url.url([this.getPath, robotId, 'run']),
          method: 'POST'
        });
      };

      return Robots;
    }
  ]);
};