module.exports = function(ngModule) {
  ngModule.factory('emRobots', [
    'emResourceFactory',
    'energimolnetAPI',
    function(resourceFactory, Api) {
      var Robots =  resourceFactory({default: '/robots'}, ['get', 'query', 'save', 'delete']);

      Robots.run = function(robotId) {
        Api.request({
          url: this.getPath + '/' + robotId + 'run',
          method: 'POST'
        });
      };

      return Robots;
    }
  ]);
};