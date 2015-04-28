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

      Consumptions.get = function get(id, granularity, ranges, metric) {
        metric = metric || 'electricity';

        return Api.request({
          method: 'GET',
          url: Url.url([this.getPath, id, granularity, ranges.join('+')]),
          params: {
            metric: metric
          }
        });
      };

      return Consumptions;
    }
  ]);
};
