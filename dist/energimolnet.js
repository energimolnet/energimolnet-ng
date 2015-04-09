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

module.exports = function(ngModule) {
  ngModule.factory('emDateUtil', function() {
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
    }
  });
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

module.exports = function(ngModule) {
  ngModule.run([
    '$window',
    'emAccounts',
    'emClients',
    'emConsumptionPreview',
    'emConsumptionStats',
    'emConsumptions',
    'emContracts',
    'emFtpConnections',
    'emMe',
    'emMeters',
    'emOwners',
    'emPassword',
    'emRefreshTokens',
    'emReports',
    'emRobotJobs',
    'emRobots',
    'emUsers',
    'emSubaccounts',
    'emDateUtil',
    'energimolnetAPI',
    function($window,
      Accounts,
      Clients,
      ConsumptionPreview,
      ConsumptionStats,
      Consumptions,
      Contracts,
      FtpConnections,
      Me,
      Meters,
      Owners,
      Password,
      RefreshTokens,
      Reports,
      RobotJobs,
      Robots,
      Users,
      Subaccounts,
      DateUtil,
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

        em.Accounts = Accounts;
        em.Clients = Clients;
        em.ConsumptionPreview = ConsumptionPreview;
        em.ConsumptionStats = ConsumptionStats;
        em.Consumptions = Consumptions;
        em.Contracts = Contracts;
        em.FtpConnections = FtpConnections;
        em.Meters = Meters;
        em.Me = Me;
        em.Owners = Owners;
        em.Password = Password;
        em.RefreshTokens = RefreshTokens;
        em.Reports = Reports;
        em.RobotJobs = RobotJobs;
        em.Robots = Robots;
        em.Subaccounts = Subaccounts;
        em.Users = Users;
        em.DateUtil = DateUtil;
        em.api = energimolnetAPI;

        $window.em = em;
    }
  ]);
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

module.exports = function(ngModule) {
  ngModule.factory('energimolnetAPI', [
    '$http',
    '$window',
    '$q',
    function($http, $window, $q) {
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
    }
  ]);
};

},{}],4:[function(require,module,exports){
/*
 * This file glues all the separate components together.
 * Angular needs to be globally available.
 */

(function(angular) {
  var module = angular.module('energimolnet', []);

  require('./resource-factory')(module);
  require('./url')(module);
  require('./energimolnet-api')(module);
  require('./debug-util')(module);
  require('./date-util')(module);

  require('./models/accounts')(module);
  require('./models/clients')(module);
  require('./models/consumption-preview')(module);
  require('./models/consumption-stats')(module);
  require('./models/consumptions')(module);
  require('./models/contracts')(module);
  require('./models/ftp-connections')(module);
  require('./models/me')(module);
  require('./models/meters')(module);
  require('./models/owners')(module);
  require('./models/password')(module);
  require('./models/refreshtokens')(module);
  require('./models/reports')(module);
  require('./models/robot-jobs')(module);
  require('./models/robots')(module);
  require('./models/subaccounts')(module);
  require('./models/users')(module);
})(angular);

},{"./date-util":1,"./debug-util":2,"./energimolnet-api":3,"./models/accounts":5,"./models/clients":6,"./models/consumption-preview":7,"./models/consumption-stats":8,"./models/consumptions":9,"./models/contracts":10,"./models/ftp-connections":11,"./models/me":12,"./models/meters":13,"./models/owners":14,"./models/password":15,"./models/refreshtokens":16,"./models/reports":17,"./models/robot-jobs":18,"./models/robots":19,"./models/subaccounts":20,"./models/users":21,"./resource-factory":22,"./url":23}],5:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('emAccounts', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/accounts'}, ['get', 'query', 'save', 'delete']);
    }
  ]);
};
},{}],6:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('emClients', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory(
        {
          default: '/clients'
        },
        ['get', 'save', 'query', 'delete'],
        {
          forAccountPath: 'clients',
          forAccountMethods: ['get', 'save', 'query', 'delete']
        });
    }
  ]);
};

},{}],7:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('emConsumptionPreview', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/consumptions'}, ['get']);
    }
  ]);
};


},{}],8:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('emConsumptionStats', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/accounts/me/consumption_stats'}, ['get']);
    }
  ]);
};
},{}],9:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('emConsumptions', [
    'emResourceFactory',
    function(resourceFactory) {
      var Consumptions = resourceFactory(
        {default: '/consumptions'},
        ['get'],
        {
          forAccountPath: 'consumptions',
          forAccountMethods: 'save',
          forAccountOptions: {
            saveMethod: 'PUT'
          }
        }
      );

      Consumptions.origGet = Consumptions.get;

      Consumptions.get = function get(id, granularity, ranges) {
        return Consumptions.origGet(id + '/' + granularity + '/' + ranges.join('+'));
      };

      return Consumptions;
    }
  ]);
};

},{}],10:[function(require,module,exports){
// Legacy support for /contracts
module.exports = function(ngModule) {
  ngModule.factory('emContracts', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({
        default: '/contracts',
        query: '/accounts/me/contracts'
      }, ['get', 'query', 'save', 'delete']);
    }
  ]);
};


},{}],11:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('emFtpConnections', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({}, [], {
        forAccountPath: 'ftp_connections',
        forAccountMethods: ['get', 'save', 'query', 'delete']
      });
    }
  ]);
};

},{}],12:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('emMe', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/accounts/me'}, ['get', 'save'], {saveMethod: 'PUT'});
    }
  ]);
};
},{}],13:[function(require,module,exports){
var PATH_ASSIGN = '/meters/many/assign_to';
var PATH_SHARE = '/meters/many/share_with';
var PATH_REVOKE = '/meters/many/revoke';

module.exports = function(ngModule) {
  ngModule.factory('emMeters', [
    'emResourceFactory',
    'energimolnetAPI',
    'emUrl',
    function(resourceFactory, Api, Url) {
      var Meters = resourceFactory({default: '/meters'}, ['get', 'query', 'save', 'delete', 'batchUpdate']);

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

          return Api.request({
            url: Url.url(url),
            method: 'POST',
            data: data
          });
        };
      }


      function _emRevoke(meterIds) {
        return Api.request({
          url: Url.url(PATH_REVOKE),
          method: 'PUT',
          data: meterIds
        });
      }
    }
  ]);
};

},{}],14:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('emOwners', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/owners'}, ['get', 'query']);
    }
  ]);
};
},{}],15:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('emPassword', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/accounts/me/password'}, ['save'], {saveMethod: 'PUT'});
    }
  ]);
};
},{}],16:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('emRefreshTokens', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/refreshtokens'}, ['query']);
    }
  ]);
};

},{}],17:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('emReports', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/reports'}, ['save']);
    }
  ]);
};
},{}],18:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('emRobotJobs', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/robot_jobs'}, ['get', 'query', 'save', 'delete']);
    }
  ]);
};

},{}],19:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('emRobots', [
    'emResourceFactory',
    'emUrl',
    'energimolnetAPI',
    function(resourceFactory, Url, Api) {
      var Robots =  resourceFactory({default: '/robots'}, ['get', 'query', 'save', 'delete']);

      Robots.run = function(robotId) {
        return Api.request({
          url: Url.url([this.getPath, robotId, 'run']),
          method: 'POST'
        });
      };

      return Robots;
    }
  ]);
};
},{}],20:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('emSubaccounts', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({}, [], {
        forAccountPath: 'subaccounts',
        forAccountMethods: ['get', 'save', 'query', 'delete']
      });
    }
  ]);
};

},{}],21:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('emUsers', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({
          default: '/users',
          query: '/accounts/me/users'
        }, ['get', 'query', 'save', 'delete']);
    }
  ]);
};

},{}],22:[function(require,module,exports){
/*
 * This factory generates model collections for Energimolnet.
 * Use the models found in the models folder.
 */
module.exports = function(ngModule) {
  ngModule.factory('emResourceFactory', [
    'emUrl',
    'energimolnetAPI',
    function (Url, Api) {
      function resourceFactory(paths, methods, options) {
        options = options || {};

        function Resource() {
          this.getPath = paths.get || paths.default;
          this.queryPath = paths.query || paths.default;
          this.savePath = paths.save || paths.default;
          this.deletePath = paths['delete'] || paths.default;
          this.batchUpdatePath = paths.batchUpdate || paths.default;
          this.options = options;
        }

        if (methods.indexOf('get') > -1) {
          Resource.prototype.get = _emGetResource;
        }

        if (methods.indexOf('query') > -1) {
          Resource.prototype.query = _emQueryResource;
        }

        if (methods.indexOf('save') > -1) {
          Resource.prototype.save = _emSaveResource;
        }

        if (methods.indexOf('batchUpdate') > -1) {
          Resource.prototype.batchUpdate = _emBatchUpdateResources;
        }

        if (methods.indexOf('delete') > -1) {
          Resource.prototype.delete = _emDeleteResource;
        }

        if (options.forAccountPath !== undefined) {
          Resource.prototype.forAccount = _emForAccount;
        }

        return new Resource();
      }

      function _emGetResource(id) {
        return Api.request({
          method: 'GET',
          url: Url.url([this.getPath, id])
        });
      }

      function _emSaveResource(object) {
        var method;
        var data = object;
        var urlComponents;

        if (object._id !== undefined || this.options.saveMethod === 'PUT') {
          urlComponents = [this.savePath, object._id];
          method = 'PUT';
          data = angular.copy(object);
          delete data._id;
        } else {
          method = 'POST';
          urlComponents = [this.savePath];
        }

        return Api.request({
          method: method,
          url: Url.url(urlComponents),
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
          url: Url.url([this.batchUpdatePath]),
          data: payload
        });
      }

      function _emQueryResource(params) {
        return Api.request({
          method: 'GET',
          url: Url.url(this.queryPath),
          params: _removeEmpty(params)
        });
      }

      function _emDeleteResource(id) {
        return Api.request({
          method: 'DELETE',
          url: Url.url([this.deletePath, id])
        });
      }

      function _emForAccount(id) {
        var paths = {
          default: '/accounts/' + id + '/' + this.options.forAccountPath
        };

        return resourceFactory(paths,
                               this.options.forAccountMethods,
                               this.options.forAccountOptions);
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
    }
  ]);
};

},{}],23:[function(require,module,exports){
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

module.exports = function(ngModule) {
  ngModule.factory('emUrl', [
    'apiBaseUrl',
    function(BASE_URL) {
      var PATH_SIGN_IN =            'security/signin';
      var PATH_SIGN_OUT =           'security/signout';
      var PATH_API_VERSION =        'api/2.0';

      function url(components) {
        components = components == null? [] : !angular.isArray(components) ? [components] : components;
        var fullPath = [BASE_URL + PATH_API_VERSION];
        
        for (var i = 0, len = components.length; i < components.length; i++) {
          var component = components[i];

          if (components[i] == null) {
            break;
          }

          fullPath.push(component.replace(/^\/|\/$/, ''));
        }

        return fullPath.join('/');
      }

      function loginUrl(redirect) { return BASE_URL + PATH_SIGN_IN + '?redirect=' + redirect; }
      function logoutUrl(redirect) { return BASE_URL + PATH_SIGN_OUT + '?redirect=' + redirect; }

      return {
        url: url,
        loginUrl: loginUrl,
        logoutUrl: logoutUrl
      };
    }
  ]);
};

},{}]},{},[4]);
