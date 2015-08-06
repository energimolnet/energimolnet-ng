module.exports = function(emResourceFactory) {
  var Complaints = emResourceFactory({
    default: '/complaints',
    get: true,
    query: true,
    post: true
  });

  return Complaints;
};
