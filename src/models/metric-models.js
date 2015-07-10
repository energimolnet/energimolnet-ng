module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/metric_models',
    get: true,
    query: true,
    put: true,
    post: true,
    delete: true
  });
};
