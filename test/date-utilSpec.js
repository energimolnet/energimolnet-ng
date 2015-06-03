describe('DateUtil', function() {
  var DateUtill;
  var BASE_URL = 'http://dummy.local';

  beforeEach(module('energimolnet'));

  beforeEach(function() {
    angular.module('energimolnet')
      .constant('apiBaseUrl', BASE_URL)
      .value('authConfig', {disabled: true});
  });

  beforeEach(inject(function(emDateUtil) {
    DateUtil = emDateUtil;
  }));

  describe('Period format tests', function() {
    it('should format single periods correctly', function() {
      var date = new Date(1426511608541);

      expect(DateUtil.getPeriod(date, 'month')).toEqual('2015');
      expect(DateUtil.getPeriod(date, 'day')).toEqual('201503');
      expect(DateUtil.getPeriod(date, 'hour')).toEqual('20150316');
    });

    it('should format range periods correctly', function() {
      var startDate = new Date(1423919853690);
      var endDate = new Date(1426511608541);

      expect(DateUtil.getPeriod([startDate, endDate], 'month')).toEqual('201502-201503');
      expect(DateUtil.getPeriod([startDate, endDate], 'day')).toEqual('20150214-20150316');
      expect(DateUtil.getPeriod([startDate, endDate], 'hour')).toEqual('20150214-20150316');
    });
  });

  describe('Period parsing tests', function() {
    it('should parse dates correctly', function() {
      var dayString = '19830206';
      var monthString = '199502';
      var yearString = '1999';
      var hourString = '200410151020';

      expect(DateUtil.getDate(dayString).getTime()).toEqual(413334000000);
      expect(DateUtil.getDate(monthString).getTime()).toEqual(791593200000);
      expect(DateUtil.getDate(yearString).getTime()).toEqual(915145200000);
      expect(DateUtil.getDate(hourString).getTime()).toEqual(1097828400000);
    });
  });

  describe('ISO parsing test', function() {
    it('should parse ISO dates correctly', function() {
      var isoDateString = '2014-08-23T22:00+0000';

      expect(DateUtil.parseISO(isoDateString).getTime()).toEqual(1408831200000);
    });
  });
});
