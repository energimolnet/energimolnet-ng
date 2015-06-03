(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Authentication
// --------------
// Setting the private token will override all other tokens

var makeUrl = require('./util/makeurl');

var PATH_TOKEN =          'oauth/token';
var PATH_SIGN_IN =        'security/signin';
var PATH_SIGN_OUT =       'security/signout';

var KEY_PRIVATE_TOKEN =   'emPrivateToken';
var KEY_REFRESH_TOKEN =   'emRefreshToken';
var KEY_ACCESS_TOKEN =    'emAccessToken';

module.exports = function($window, $http, $q, authConfig, BASE_URL) {
  var requestQueue = [];
  var fetchingAccessToken = false;

  function getPrivateToken() { return getToken(KEY_PRIVATE_TOKEN); }
  function getRefreshToken() { return getToken(KEY_REFRESH_TOKEN); }
  function getAccessToken() { return getToken(KEY_ACCESS_TOKEN); }

  function setPrivateToken(token) { setToken(token, KEY_PRIVATE_TOKEN); }
  function setRefreshToken(token) { setToken(token, KEY_REFRESH_TOKEN); }
  function setAccessToken(token) { setToken(token, KEY_ACCESS_TOKEN); }

  function getToken(key) {
    var value = $window.localStorage.getItem(key);

    if (value && (value.charAt(0) == '{' || value.charAt(0) == '[')) {
      return JSON.parse(value);
    }

    return value;
  }

  function setToken(token, key) {
    if (token && token.length > 0) {
      var type = typeof token;

      if (type !== 'string' && type !== 'number') {
        key = JSON.stringify(key);
      }

      $window.localStorage.setItem(key, token);
    } else {
      $window.localStorage.removeItem(key);
    }
  }

  function authorize(config) {
    return $q(function(resolve, reject) {
      var token = getPrivateToken();

      // Check for private api token
      if (token) {
        config.headers = {Authorization: 'OAuth ' + token};
        resolve(config);
        return;
      }

      // Check if OAuth is disabled in config. In that case, browser needs to
      // manage the authentication using session cookies
      if (authConfig.disabled) {
        resolve(config);
        return;
      }

      // Check for OAuth refresh token
      var refreshToken = getRefreshToken();

      if (!refreshToken) {
        reject();
        return;
      }

      ensureAccessToken(refreshToken).then(function(accessToken) {
        config.headers = {Authorization: 'Bearer ' + accessToken.access_token};
        resolve(config);
      }, function() {
        reject();
      });
    });
  }

  function ensureAccessToken(refreshToken) {
    return $q(function(resolve, reject) {
      var accessToken = getAccessToken();

      if (isValidToken(accessToken) && accessToken.refresh_token === refreshToken) {
        // User has a valid access token already, resolve with it
        resolve(accessToken);
      } else {
        // User has no valid token
        requestQueue.push(function(newAccessToken) {
          if (newAccessToken) {
            resolve(newAccessToken);
          } else {
            reject();
          }
        });

        // Only fetch token if we're not already fetching it
        if (!fetchingAccessToken) {
          fetchingAccessToken = true;

          fetchAccessToken(refreshToken).then(function(res) {
            var newToken = res.data;

            setAccessToken(newToken);
            fetchingAccessToken = false;

            // Process any pending requests
            requestQueue.forEach(function(queueFunc) {
              queueFunc(newToken);
            });

            // Clear queue
            requestQueue = [];
          }, function(err) {
            setAccessToken(null);
            fetchingAccessToken = false;

            // Process any pending requests
            requestQueue.forEach(function(queueFunc) {
              queueFunc(null);
            });

            // Clear queue
            requestQueue = [];
          });
        }
      }
    });
  }

  function isValidToken(token) {
    return (token && token.expires_at > Date.now());
  }

  function fetchAccessToken(refreshToken) {
    return $http.post(makeUrl([BASE_URL, PATH_TOKEN]), {
      client_id: authConfig.clientId,
      client_secret: authConfig.clientSecret,
      grant_type: 'refresh_token',
      scope: 'basic',
      refresh_token: refreshToken
    }).then(function(token) {
      token.expires_at = Date.now() + token.expires_in * 1000;
      return token;
    });
  }

  function loginUrl(redirect) { return BASE_URL + PATH_SIGN_IN + '?redirect=' + redirect; }
  function logoutUrl(redirect) { return BASE_URL + PATH_SIGN_OUT + '?redirect=' + redirect; }

  return {
    getPrivateToken: getPrivateToken,
    setPrivateToken: setPrivateToken,
    getRefreshToken: getRefreshToken,
    setRefreshToken: setRefreshToken,
    loginUrl: loginUrl,
    logoutUrl: logoutUrl,
    authorize: authorize
  };
};

},{"./util/makeurl":27}],2:[function(require,module,exports){
/**
  DateUtil
  --------

  This module provides helper function to create request periods from
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

module.exports = {
  getDate: getDate,
  getDayPeriod: getDayPeriod,
  getMonthPeriod: getMonthPeriod,
  getPeriod: getPeriod,
  getYearPeriod: getYearPeriod,
  daysInMonth: daysInMonth,
  parseISO: parseISO,
};

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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
 *   energimolnetAPI.request({url: '/owners', params:...})
 */
var makeUrl = require('./util/makeurl');

var PATH_API_VERSION =        'api/2.0';
var EVENT_LOGIN_NEEDED =      'em:loginNeeded';

module.exports = function($http, $q, $rootScope, Auth, BASE_URL) {
  function request(config) {
    return $q(function(resolve, reject) {
      config.url = makeUrl([BASE_URL, PATH_API_VERSION, config.url]);

      Auth.authorize(config).then(function(config) {
        $http(config).then(function(res) {
          resolve(parseResponse(res));
        }, function(res) {
          if (res.status === 401) {
            // Reset private token if it existed
            if (Auth.getPrivateToken()) {
              Auth.setPrivateToken(null);
              // TODO: Retry request
              loginNeeded();
            } else {
              loginNeeded();
            }
          }

          reject(res.data ? res.data.errors : {});
        });
      }, function() {
        loginNeeded();
        reject({});
      });
    });
  }

  function loginNeeded() {
    $rootScope.$broadcast(EVENT_LOGIN_NEEDED);
  }

  function parseResponse(res) {
    if (res.data.count == null || res.data.limit == null || res.data.skip == null) {
      return res.data.data;
    } else {
      return {
        data: res.data.data,
        pagination: {
          skip: res.data.skip,
          limit: res.data.limit,
          count: res.data.count,
          page: 1 + (res.data.skip / res.data.limit),
          from: (res.data.count === 0) ? 0 : res.data.skip + 1,
          to: (res.data.skip + res.data.limit > res.data.count) ? res.data.count : res.data.skip + res.data.limit
        }
      };
    }
  }

  return {
    request: request
  };
};

},{"./util/makeurl":27}],5:[function(require,module,exports){
/*
 * This file glues all the separate components together.
 * Angular needs to be globally available.
 */

var MODULE_NAME = 'energimolnet';
var module = angular.module(MODULE_NAME, []);

if (typeof module === 'object') {
  module.exports = MODULE_NAME;
}

module
  .factory('emDateUtil', function() { return require('./date-util'); })
  .factory('emAuth', ['$window', '$http', '$q', 'authConfig', 'apiBaseUrl', require('./auth')])
  .factory('energimolnetAPI', ['$http', '$q', '$rootScope', 'emAuth', 'apiBaseUrl', require('./energimolnet-api')])
  .factory('emResourceFactory', ['energimolnetAPI', require('./resource-factory')])

  .factory('emAccounts', ['emResourceFactory', require('./models/accounts')])
  .factory('emClients', ['emResourceFactory', require('./models/clients')])
  .factory('emConsumptionPreview', ['emResourceFactory', require('./models/consumption-preview')])
  .factory('emConsumptionStats', ['emResourceFactory', require('./models/consumption-stats')])
  .factory('emConsumptions', ['emResourceFactory', 'energimolnetAPI', require('./models/consumptions')])
  .factory('emEdielJobs', ['emResourceFactory', require('./models/ediel-jobs')])
  .factory('emFileJobs', ['emResourceFactory', require('./models/file-jobs')])
  .factory('emFtpConnections', ['emResourceFactory', require('./models/ftp-connections')])
  .factory('emMe', ['emResourceFactory', require('./models/me')])
  .factory('emMeters', ['emResourceFactory', 'energimolnetAPI', require('./models/meters')])
  .factory('emOwners', ['emResourceFactory', require('./models/owners')])
  .factory('emPassword', ['emResourceFactory', require('./models/password')])
  .factory('emRefreshTokens', ['emResourceFactory', require('./models/refreshtokens')])
  .factory('emReports', ['emResourceFactory', require('./models/reports')])
  .factory('emRobotJobs', ['emResourceFactory', require('./models/robot-jobs')])
  .factory('emRobots', ['emResourceFactory', 'energimolnetAPI', require('./models/robots')])
  .factory('emScrapers', ['emResourceFactory', require('./models/scrapers')])
  .factory('emSubaccounts', ['emResourceFactory', require('./models/subaccounts')])
  .factory('emSubscribers', ['emResourceFactory', require('./models/subscribers')])
  .factory('emTokens', ['emResourceFactory', require('./models/tokens')])

  .run(['$window', 'emAccounts', 'emClients', 'emConsumptionPreview', 'emConsumptionStats', 'emConsumptions', 'emEdielJobs', 'emFileJobs', 'emFtpConnections', 'emMe', 'emMeters', 'emOwners', 'emPassword', 'emRefreshTokens', 'emReports', 'emRobotJobs', 'emRobots', 'emScrapers', 'emSubaccounts', 'emSubscribers', 'emTokens', 'emDateUtil', 'energimolnetAPI', require('./debug-util')]);

},{"./auth":1,"./date-util":2,"./debug-util":3,"./energimolnet-api":4,"./models/accounts":6,"./models/clients":7,"./models/consumption-preview":8,"./models/consumption-stats":9,"./models/consumptions":10,"./models/ediel-jobs":11,"./models/file-jobs":12,"./models/ftp-connections":13,"./models/me":14,"./models/meters":15,"./models/owners":16,"./models/password":17,"./models/refreshtokens":18,"./models/reports":19,"./models/robot-jobs":20,"./models/robots":21,"./models/scrapers":22,"./models/subaccounts":23,"./models/subscribers":24,"./models/tokens":25,"./resource-factory":26}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/consumptions',
    get: true
  });
};


},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
module.exports = function(emResourceFactory, energimolnetAPI) {
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
      url: [this._config.default, id, granularity, ranges.join('+')].join('/'),
      params: {
        metrics: metrics.join(',')
      }
    });
  };

  return Consumptions;
};

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/accounts/me',
    get: true,
    put: true
  });
};

},{}],15:[function(require,module,exports){
var PATH_ASSIGN = '/meters/many/assign_to';
var PATH_SHARE = '/meters/many/share_with';
var PATH_REVOKE = '/meters/many/revoke';

module.exports = function(emResourceFactory, energimolnetAPI) {
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
        url: url,
        method: 'POST',
        data: data
      });
    };
  }

  function _emRevoke(meterIds) {
    return energimolnetAPI.request({
      url: PATH_REVOKE,
      method: 'PUT',
      data: meterIds
    });
  }
};

},{}],16:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/owners',
    get: true,
    query: true
  });
};

},{}],17:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/accounts/me/password',
    put: true
  });
};

},{}],18:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/refreshtokens',
    query: true
  });
};

},{}],19:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/reports',
    post: true
  });
};

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
module.exports = function(emResourceFactory) {
  return emResourceFactory({
    default: '/scrapers',
    get: true,
    query: true
  });
};

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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
      Resource.prototype.forAccount = _emForAccount;
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

},{"./util/makeurl":27}],27:[function(require,module,exports){
module.exports = function makeUrl(components) {
  components = components == null? [] : !angular.isArray(components) ? [components] : components;
  var fullPath = [];

  for (var i = 0, len = components.length; i < len; i++) {
    var component = components[i];

    if (component == null) {
      break;
    }

    fullPath.push(component.replace(/^\/|\/$/, ''));
  }

  return fullPath.join('/');
};

},{}]},{},[5]);
