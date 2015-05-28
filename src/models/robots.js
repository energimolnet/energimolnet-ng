module.exports = function(emResourceFactory, energimolnetAPI) {
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
      url: [this._config.default, robotId, 'run'].join('/'),
      method: 'POST'
    });
  };

  return Robots;
};
