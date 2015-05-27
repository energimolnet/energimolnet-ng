module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/robot_jobs',
    get: true,
    query: true,
    put: true,
    post: true,
    delete: true
  });
};
