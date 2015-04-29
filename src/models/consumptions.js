module.exports = function(ngModule) {
  ngModule.factory('emConsumptions', [
    'emResourceFactory',
    'energimolnetAPI',
    'emUrl',
    function(resourceFactory, Api, Url) {
      var Consumptions = resourceFactory({
        default: '/consumptions',
        forAccount: {
          default: 'consumptions',
          put: true
        }
      });

      Consumptions.get = function get(id, granularity, ranges, metrics) {
        metrics = metrics || ['energy'];
        metrics = angular.isArray(metrics) ? metrics : [metrics];
        ranges = angular.isArray(ranges) ? ranges : [ranges];

        return Api.request({
          method: 'GET',
          url: Url.url([this._config.default, id, granularity, ranges.join('+')]),
          params: {
            metrics: metrics.join(',')
          }
        });
      };

      return Consumptions;
    }
  ]);
};
