module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/file_jobs',
    get: true,
    query: true,
    put: true,
    save: true,
    delete: true
  });
};
