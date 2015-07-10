module.exports = function(emResourceFactory) {
  return emResourceFactory({
    forMeter: {
      default: 'calculated_metrics',
      get: true,
      put: true,
      post: true,
      query: true,
      delete: true
    }
  });
};
