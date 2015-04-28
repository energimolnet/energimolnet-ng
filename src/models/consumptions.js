module.exports = function(ngModule) {
  ngModule.factory('emConsumptions', [
    'emResourceFactory',
    'energimolnetAPI',
    'emUrl',
    function(resourceFactory, Api, Url) {
      var Consumptions = resourceFactory(
        {default: '/consumptions'},
        [],
        {
          forAccountPath: 'consumptions',
          forAccountMethods: 'save',
          forAccountOptions: {
            saveMethod: 'PUT'
          }
        }
      );

      Consumptions.get = function get(id, granularity, ranges, metrics) {
        metrics = metrics || ['energy'];
        metrics = angular.isArray(metrics) ? metrics : [metrics];
        ranges = angular.isArray(ranges) ? ranges : [ranges];

        return Api.request({
          method: 'GET',
          url: Url.url([this.getPath, id, granularity, ranges.join('+')]),
          params: {
            metrics: metrics.join(',')
          }
        });
      };

      return Consumptions;
    }
  ]);
};
