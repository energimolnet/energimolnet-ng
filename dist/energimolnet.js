(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
  DateUtil
  --------

  This service provides helper function to create request periods from
  Javascript date objects.

  Typically, you use the getPeriod(dates, granularity) function, which in
  its turn calls an appropriate function, depending on the granularity.

  The dates parameter can be either a single date, which returns a single
  period (e.g. YYYYMMDD), or an array with two Dates (range), which returns
  a period range, (e.g. YYYYMM-YYYYMM)

  To parse a period into a date, use the getDate(period) function. This will
  return a Date with the provided period. Periods without months or days will
  have the missing value set to 1, i.e. getDate("2004") will return a the Date
  2014-01-01.
**/

module.exports = function() {
  function _zeroPaddedString(number) {
    if (number == null) { return ''; }

    return (number < 10 ? '0' : '') + number;
  }

  function _periodFormat(year, month, day) {
    if (month != null) { month ++; }

    return _zeroPaddedString(year) + _zeroPaddedString(month) + _zeroPaddedString(day);
  }

  function periodsFormat(dates, func) {
    if (!angular.isArray(dates)) { return func(dates); }
    return dates.map(func).join('-');
  }

  function getYearPeriod(dates) {
    return periodsFormat(dates, function(date) {
      return _periodFormat(date.getFullYear());
    });
  }

  function getMonthPeriod(dates) {
    return periodsFormat(dates, function(date) {
      return _periodFormat(date.getFullYear(), date.getMonth());
    });
  }

  function getDayPeriod(dates) {
    return periodsFormat(dates, function(date) {
      return _periodFormat(date.getFullYear(), date.getMonth(), date.getDate());
    });
  }

  function getPeriod(dates, granularity) {
    var isRange = angular.isArray(dates) && dates.length > 1;

    if (granularity === 'month') {
      return isRange ? getMonthPeriod(dates) : getYearPeriod(dates);
    }

    if (granularity === 'day') {
      return isRange ? getDayPeriod(dates) : getMonthPeriod(dates);
    }

    return getDayPeriod(dates);
  }

  function getDate(period) {
    if (period.length < 4) { return new Date(); }

    var components = [parseInt(period.substr(0, 4), 10)];
    var i = 0, len = period.length;

    while (4 + (i * 2) < len) {
      components[i + 1] = parseInt(period.substr(4 + (2 * i), 2));
      i++;
    }

    return new Date(components[0],                          // hour
                    components[1] ? components[1] - 1 : 0,  // month
                    components[2] || 1,                     // day
                    components[3] || 0,                     // hour
                    components[4] || 0,                     // min
                    components[5] || 0);                    // second
  }

  // Helper function for returning the number of days in a month
  function daysInMonth(date) {
    var d = new Date(date.getTime());
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);

    return d.getDate();
  }

  // IE and Safari fail at parsing ISO strings without : in time zone offset.
  // This is a fix for that. This fix only accounts for whole hours in offset.
  function parseISO(dateString) {
    var timestamp = Date.parse(dateString);

    if (!isNaN(timestamp)) {
      return new Date(timestamp);
    }

    var date, offsetString, offset;
    var components = dateString.slice(0,-5).split(/\D/).map(function(itm){
      return parseInt(itm, 10) || 0;
    });

    components[1]-= 1;
    offsetString = dateString.slice(-5);
    offset = parseInt(offsetString, 10) / 100;

    date = new Date(Date.UTC.apply(Date, components));
    date.setHours(date.getHours() - offset);
    return date;
  }

  return {
    getDate: getDate,
    getDayPeriod: getDayPeriod,
    getMonthPeriod: getMonthPeriod,
    getPeriod: getPeriod,
    getYearPeriod: getYearPeriod,
    daysInMonth: daysInMonth,
    parseISO: parseISO,
  };
};

},{}],2:[function(require,module,exports){
/*
 * This attaches an em object to window that can be used for testing
 * and debugging.
 *
 * The em function is used to log the data or error returned from the
 * promise that the collection models return.
 *
 * E.g.
 *
 *   em(em.Owners.query({name: 'Öresunds'}))
 *
 */

module.exports = function($window,
                          emAccounts,
                          emClients,
                          emConsumptionPreview,
                          emConsumptionStats,
                          emConsumptions,
                          emEdielJobs,
                          emFileJobs,
                          emFtpConnections,
                          emMe,
                          emMeters,
                          emOwners,
                          emPassword,
                          emRefreshTokens,
                          emReports,
                          emRobotJobs,
                          emRobots,
                          emScrapers,
                          emSubaccounts,
                          emSubscribers,
                          emTokens,
                          emDateUtil,
                          energimolnetAPI) {
  function em(func, condensed) {
    func.then(function(res) {
      if (condensed === true) {
        $window.console.log('Response:\n', res);
      } else {
        $window.console.log('Response:\n', JSON.stringify(res, null, 2));
      }
    }, function(err) {
      $window.console.log('Error:\n', err);
    });
  }

  em.Accounts = emAccounts;
  em.Clients = emClients;
  em.ConsumptionPreview = emConsumptionPreview;
  em.ConsumptionStats = emConsumptionStats;
  em.Consumptions = emConsumptions;
  em.EdielJobs = emEdielJobs;
  em.FileJobs = emFileJobs;
  em.FtpConnections = emFtpConnections;
  em.Meters = emMeters;
  em.Me = emMe;
  em.Owners = emOwners;
  em.Password = emPassword;
  em.RefreshTokens = emRefreshTokens;
  em.Reports = emReports;
  em.RobotJobs = emRobotJobs;
  em.Robots = emRobots;
  em.Scrapers = emScrapers;
  em.Subaccounts = emSubaccounts;
  em.Subscribers = emSubscribers;
  em.Tokens = emTokens;
  em.DateUtil = emDateUtil;
  em.api = energimolnetAPI;

  $window.em = em;
};

},{}],3:[function(require,module,exports){
/*
 * This service performs communication with Energimolnet API.
 * It formats requests to required format and parses the
 * responses in a suitable way.
 *
 * Unless needed, use the api models to communicate with the API
 * on a higher level.
 * I.e.:
 *
 * Do:
 *
 *   Owners.query({name: 'Halmstad'})
 *
 * Dont':
 *
 *   energimolnetAPI.request({url: 'http://app.../owners', params:...})
 */

module.exports = function($http, $window, $q) {
  function request(config) {
    return $q(function(resolve, reject) {
      $http(_emAuthorize(config)).then(function(res) {
        if (res.data.count == null || res.data.limit == null || res.data.skip == null) {
          resolve(res.data.data);
        } else {
          resolve({
            data: res.data.data,
            pagination: {
              skip: res.data.skip,
              limit: res.data.limit,
              count: res.data.count,
              page: 1 + (res.data.skip / res.data.limit),
              from: (res.data.count === 0) ? 0 : res.data.skip + 1,
              to: (res.data.skip + res.data.limit > res.data.count) ? res.data.count : res.data.skip + res.data.limit
            }
          })
        }
      }, function(res) {
        if (res.status === 401) { // User is not logged in
          setToken(undefined);
        }

        reject(res.data != null ? res.data.errors : {});
      })
    });
  }

  // Impersonation
  // -------------
  // Setting the API token will override the session authentication (if any)
  var KEY_API_TOKEN = 'energimolnetApiToken';

  function getToken() {
    return $window.localStorage.getItem(KEY_API_TOKEN);
  }

  function setToken(token) {
    if (token != null && token.length > 0) {
      $window.localStorage.setItem(KEY_API_TOKEN, token);
    } else {
      $window.localStorage.removeItem(KEY_API_TOKEN);
    }
  }

  // Pre-processing of request
  function _emAuthorize(config) {
    var token = getToken();

    if (token != null) {
      config.headers = {Authorization: 'OAuth ' + token};
    }

    return config;
  }

  return {
    getToken: getToken,
    setToken: setToken,
    request: request,
  };
};

},{}],4:[function(require,module,exports){
/*
 * This file glues all the separate components together.
 * Angular needs to be globally available.
 */

(function(angular) {
  var MODULE_NAME = 'energimolnet';

  var module = angular.module(MODULE_NAME, []);

  module
    .factory('emResourceFactory', require('./resource-factory'))
    .factory('emUrl', require('./url'))
    .factory('energimolnetAPI', require('./energimolnet-api'))
    .factory('emDateUtil', require('./date-util'))

    .factory('emAccounts', require('./models/accounts'))
    .factory('emClients', require('./models/clients'))
    .factory('emConsumptionPreview', require('./models/consumption-preview'))
    .factory('emConsumptionStats', require('./models/consumption-stats'))
    .factory('emConsumptions', require('./models/consumptions'))
    .factory('emEdielJobs', require('./models/ediel-jobs'))
    .factory('emFileJobs', require('./models/file-jobs'))
    .factory('emFtpConnections', require('./models/ftp-connections'))
    .factory('emMe', require('./models/me'))
    .factory('emMeters', require('./models/meters'))
    .factory('emOwners', require('./models/owners'))
    .factory('emPassword', require('./models/password'))
    .factory('emRefreshTokens', require('./models/refreshtokens'))
    .factory('emReports', require('./models/reports'))
    .factory('emRobotJobs', require('./models/robot-jobs'))
    .factory('emRobots', require('./models/robots'))
    .factory('emScrapers', require('./models/scrapers'))
    .factory('emSubaccounts', require('./models/subaccounts'))
    .factory('emSubscribers', require('./models/subscribers'))
    .factory('emTokens', require('./models/tokens'))

    .run(require('./debug-util'));

})(angular);

},{"./date-util":1,"./debug-util":2,"./energimolnet-api":3,"./models/accounts":5,"./models/clients":6,"./models/consumption-preview":7,"./models/consumption-stats":8,"./models/consumptions":9,"./models/ediel-jobs":10,"./models/file-jobs":11,"./models/ftp-connections":12,"./models/me":13,"./models/meters":14,"./models/owners":15,"./models/password":16,"./models/refreshtokens":17,"./models/reports":18,"./models/robot-jobs":19,"./models/robots":20,"./models/scrapers":21,"./models/subaccounts":22,"./models/subscribers":23,"./models/tokens":24,"./resource-factory":25,"./url":26}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/clients',
    get: true,
    put: true,
    post: true,
    query: true,
    delete: true,
    forAccount: {
      default: 'clients',
      get: true,
      put: true,
      post: true,
      query: true,
      delete: true
    }
  });
};

},{}],7:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/consumptions',
    get: true
  });
};


},{}],8:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/accounts/me/consumption_stats',
    get: true,
    forAccount: {
      default: 'consumption_stats',
      get: true
    }
  });
};

},{}],9:[function(require,module,exports){
module.exports = function(emResourceFactory, energimolnetAPI, emUrl) {
  var Consumptions = emResourceFactory({
    default: '/consumptions',
    forAccount: {
      default: 'consumptions',
      put: true
    }
  });

  Consumptions.get = function get(id, granularity, ranges, metrics) {
    metrics = metrics || ['energy'];
    metrics = angular.isArray(metrics) ? metrics : [metrics];
    ranges = angular.isArray(ranges) ? ranges : [ranges];

    return energimolnetAPI.request({
      method: 'GET',
      url: emUrl.url([this._config.default, id, granularity, ranges.join('+')]),
      params: {
        metrics: metrics.join(',')
      }
    });
  };

  return Consumptions;
};

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    forAccount: {
      default: 'ftp_connections',
      get: true,
      query: true,
      put: true,
      post: true,
      delete: true
    }
  });
};

},{}],13:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/accounts/me',
    get: true,
    put: true
  });
};

},{}],14:[function(require,module,exports){
var PATH_ASSIGN = '/meters/many/assign_to';
var PATH_SHARE = '/meters/many/share_with';
var PATH_REVOKE = '/meters/many/revoke';

module.exports = function(emResourceFactory, energimolnetAPI, emUrl) {
  var Meters = emResourceFactory({
    default: '/meters',
    get: true,
    query: true,
    put: true,
    post: true,
    delete: true,
    batch: true
  });

  Meters.assign = _emShareAssign(PATH_ASSIGN);
  Meters.share = _emShareAssign(PATH_SHARE);
  Meters.revoke = _emRevoke;

  return Meters;

  function _emShareAssign(url) {
    return function(meterIds, accountIds) {
      var data = [];

      var metersLength = meterIds.length;
      var accountsLength = accountIds.length;

      for (var i = 0; i < metersLength; i++) {
        var meterId = meterIds[i];

        for (var j = 0; j < accountsLength; j++) {
          var accountId = accountIds[j];

          data.push({
            _id: meterId,
            holder: accountId
          });
        }
      }

      return energimolnetAPI.request({
        url: emUrl.url(url),
        method: 'POST',
        data: data
      });
    };
  }

  function _emRevoke(meterIds) {
    return energimolnetAPI.request({
      url: emUrl.url(PATH_REVOKE),
      method: 'PUT',
      data: meterIds
    });
  }
};

},{}],15:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/owners',
    get: true,
    query: true
  });
};

},{}],16:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/accounts/me/password',
    put: true
  });
};

},{}],17:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/refreshtokens',
    query: true
  });
};

},{}],18:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/reports',
    post: true
  });
};

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/scrapers',
    get: true,
    query: true
  });
};

},{}],22:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    forAccount: {
      default: 'subaccounts',
      get: '/accounts',
      put: true,
      post: true,
      query: true,
      delete: '/accounts'
    }
  });
};

},{}],23:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    forAccount: {
      default: 'meter_subscribers',
      get: true,
      put: true,
      post: true,
      query: true,
      delete: true
    }
  });
};

},{}],24:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    forAccount: {
      default: 'tokens',
      get: true,
      put: true,
      post: true,
      query: true,
      delete: true
    }
  });
};

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
/*
 * This factory generates urls for accessing the Energimolnet API
 * based on current configurations.
 *
 * url
 * ----
 * Returns the url for accessing the Energimolnet API based on current
 * configurations (e.g. development/staging/production and api version).
 *
 *
 * Params:
 *  * components: Array The path components to append to the base path.
 *
 * Example:
 *   url(['accounts', 'me'])
 *   -> http://app.energimolnet.se/api/v2/accounts/me
 *
 *
 * loginUrl
 * --------
 * Returns a url to present to the user for logging in.
 *
 * Params:
 *  * redirect: String  The url of the page to redirect to when login
 *                      has finished.
 *
 *
 * logoutUrl
 * ---------
 * Returns a url to present to the user to logout (when using session login)
 *
 * Params:
 *  * redirect: String  The url of the page to redirect to when logout
 *                      has finished.
 *
 */

module.exports = function(apiBaseUrl) {
  var PATH_SIGN_IN =            'security/signin';
  var PATH_SIGN_OUT =           'security/signout';
  var PATH_API_VERSION =        'api/2.0';

  function url(components) {
    components = components == null? [] : !angular.isArray(components) ? [components] : components;
    var fullPath = [apiBaseUrl + PATH_API_VERSION];

    for (var i = 0, len = components.length; i < components.length; i++) {
      var component = components[i];

      if (components[i] == null) {
        break;
      }

      fullPath.push(component.replace(/^\/|\/$/, ''));
    }

    return fullPath.join('/');
  }

  function loginUrl(redirect) { return apiBaseUrl + PATH_SIGN_IN + '?redirect=' + redirect; }
  function logoutUrl(redirect) { return apiBaseUrl + PATH_SIGN_OUT + '?redirect=' + redirect; }

  return {
    url: url,
    loginUrl: loginUrl,
    logoutUrl: logoutUrl
  };
};

},{}]},{},[4]);
