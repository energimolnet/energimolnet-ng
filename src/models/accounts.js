module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/accounts',
    get: true,
    query: true,
    put: true,
    post: true,
    delete: true
  });
};
