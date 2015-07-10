/*
 * This factory generates model collections for Energimolnet.
 * Use the models found in the models folder.
 */

var makeUrl = require('./util/makeurl');
var ACCOUNTS_PATH = '/accounts';

module.exports = function (Api) {
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
      Resource.prototype.forAccount = _emForResource('accounts', config.forAccount);
    }

    if (config.forMeter) {
      Resource.prototype.forMeter = _emForResource('meters', config.forMeter);
    }

    return new Resource();
  }

  function _emPath(config, method) {
    var value = config[method];
    return value === true ? config.default : value;

  }
  function _emGetResource(id) {
    return Api.request({
      method: 'GET',
      url: makeUrl([_emPath(this._config, 'get'), id])
    });
  }

  function _emSaveResource(object) {
    var method;
    var data = object;
    var path;

    if (object._id !== undefined || !this._config.post) {
      method = 'PUT';
      path = _emPath(this._config, 'put') + '/' + object._id;
      data = angular.copy(object);
      delete data._id;
    } else {
      method = 'POST';
      path = _emPath(this._config, 'post');
    }

    return Api.request({
      method: method,
      url: path,
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

    return Api.request({
      method: 'PUT',
      url: _emPath(this._config, 'batch'),
      data: payload
    });
  }

  function _emQueryResource(params) {
    return Api.request({
      method: 'GET',
      url: _emPath(this._config, 'query'),
      params: _removeEmpty(params)
    });
  }

  function _emDeleteResource(id) {
    return Api.request({
      method: 'DELETE',
      url: makeUrl([_emPath(this._config, 'delete'), id])
    });
  }

  function _emForResource(resourceName, resourceConfig) {
    var _this = this;

    return function _forResource(id) {
      var config = angular.copy(resourceConfig);

      ['default', 'get', 'put', 'post', 'delete', 'query'].forEach(function(method) {
        var value = config[method];

        // Append resource/id/ to paths that don't start with /
        if (typeof value === 'string' && value[0] !== '/') {
          config[method] = '/' + resourceName + '/' + id + '/' + value;
        }
      });

      return resourceFactory(config);
    };
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
