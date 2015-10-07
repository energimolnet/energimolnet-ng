module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/stats/meters',
    get: false,
    query: true,
    put: false,
    post: false,
    delete: false
  });
};
