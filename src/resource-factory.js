/*
 * This factory generates model collections for Energimolnet.
 * Use the models found in the models folder.
 */

var ACCOUNTS_PATH = '/accounts';

module.exports = function (emUrl, energimolnetAPI) {
  function resourceFactory(config) {
    function Resource() {
      this._config = config;
    }

    if (config.get) {
      Resource.prototype.get = _emGetResource;
    }

    if (config.query) {
      Resource.prototype.query = _emQueryResource;
    }

    if (config.put || config.post) {
      Resource.prototype.save = _emSaveResource;
    }

    if (config.batch) {
      Resource.prototype.batchUpdate = _emBatchUpdateResources;
    }

    if (config.delete) {
      Resource.prototype.delete = _emDeleteResource;
    }

    if (config.forAccount) {
      Resource.prototype.forAccount = _emForAccount;
    }

    return new Resource();
  }

  function _emPath(config, method) {
    var value = config[method];
    return value === true ? config.default : value;

  }
  function _emGetResource(id) {
    return energimolnetAPI.request({
      method: 'GET',
      url: emUrl.url([_emPath(this._config, 'get'), id])
    });
  }

  function _emSaveResource(object) {
    var method;
    var data = object;
    var urlComponents;

    if (object._id !== undefined || !this._config.post) {
      method = 'PUT';
      urlComponents = [_emPath(this._config, 'put'), object._id];
      data = angular.copy(object);
      delete data._id;
    } else {
      method = 'POST';
      urlComponents = [_emPath(this._config, 'post')];
    }

    return energimolnetAPI.request({
      method: method,
      url: emUrl.url(urlComponents),
      data: data
    });
  }

  function _emBatchUpdateResources(ids, properties) {
    var payload = [];

    for (var i = 0, len = ids.length; i < len; i++) {
      var update = angular.copy(properties);
      update._id = ids[i];
      payload.push(update);
    }

    return energimolnetAPI.request({
      method: 'PUT',
      url: emUrl.url(_emPath(this._config, 'batch')),
      data: payload
    });
  }

  function _emQueryResource(params) {
    return energimolnetAPI.request({
      method: 'GET',
      url: emUrl.url(_emPath(this._config, 'query')),
      params: _removeEmpty(params)
    });
  }

  function _emDeleteResource(id) {
    return energimolnetAPI.request({
      method: 'DELETE',
      url: emUrl.url([_emPath(this._config, 'delete'), id])
    });
  }

  function _emForAccount(id) {
    var config = angular.copy(this._config.forAccount);

    ['default', 'get', 'put', 'post', 'delete', 'query'].forEach(function(method) {
      var value = config[method];

      // Append accounts/id/ to paths that don't start with /
      if (typeof value === 'string' && value[0] !== '/') {
        config[method] = '/accounts/' + id + '/' + value;
      }
    });

    return resourceFactory(config);
  }

  function _removeEmpty(object) {
    var params = {};

    for (var key in object) {
      if (!object.hasOwnProperty(key)) { continue; }

      var value = object[key];
      var isString = angular.isString(value);

      if (value != null && ((isString && value.length > 0) || !isString)) {
        params[key] = value;
      }
    }

    return params;
  }

  return resourceFactory;
};
