module.exports = function(ngModule) {
  ngModule.factory('emRobots', [
    'emResourceFactory',
    'emUrl',
    'energimolnetAPI',
    function(resourceFactory, Url, Api) {
      var Robots =  resourceFactory({
        default: '/robots',
        get: true,
        query: true,
        put: true,
        post: true,
        delete: true
      });

      Robots.run = function(robotId) {
        return Api.request({
          url: Url.url([this._config.default, robotId, 'run']),
          method: 'POST'
        });
      };

      return Robots;
    }
  ]);
};
