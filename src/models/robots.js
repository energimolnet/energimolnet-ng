module.exports = function(emResourceFactory, emUrl, energimolnetAPI) {
  var Robots = emResourceFactory({
    default: '/robots',
    get: true,
    query: true,
    put: true,
    post: true,
    delete: true
  });

  Robots.run = function(robotId) {
    return energimolnetAPI.request({
      url: emUrl.url([this._config.default, robotId, 'run']),
      method: 'POST'
    });
  };

  return Robots;
};
