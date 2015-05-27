module.exports = function(emResourceFactory, energimolnetAPI, emUrl) {
  var Consumptions = emResourceFactory({
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

    return energimolnetAPI.request({
      method: 'GET',
      url: emUrl.url([this._config.default, id, granularity, ranges.join('+')]),
      params: {
        metrics: metrics.join(',')
      }
    });
  };

  return Consumptions;
};
