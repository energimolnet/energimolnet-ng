module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/ediel_jobs',
    get: true,
    query: true,
    put: true,
    post: true,
    delete: true
  });
};
