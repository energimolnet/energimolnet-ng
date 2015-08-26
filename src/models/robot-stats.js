module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/stats/robots',
    get: false,
    query: true,
    put: false,
    post: false,
    delete: false
  });
};

