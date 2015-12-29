var q = require('q');
var _queue;
var _storage;
var _provider;
var _from;
/**
 * A tool for sending texts
 * @class PhoneService
 * @param {PhoneProvider} provider the phone provider which this service delegates to
 * @param {StorageService} storage an instance of le-storage-service that is used to create records
 * @param {string} from the phone number to send the texts from
 * @returns {service}
 */
var PhoneService = function (provider, storage, from) {
  if (!provider) { throw new Error('Phone provider required'); }
  if (!storage) { throw new Error('Instance of le-storage-service required'); }
  if (!from) { throw new Error('From phone number required'); }
  _storage = storage;
  _provider = provider;
  _from = from;
  _queue = [];
  /**
   * Sends a text message
   * @function text
   * @memberof PhoneService
   * @instance
   * @param {string} to the phone number of the recipient
   * @param {string} message the content of the text message
   * @returns {promise} resolves with the newly created text record
   */
  this.text = function (to, message) {
    var deferred = q.defer();
    _queue.push({
      to: to,
      message: message,
      deferred: deferred
    });
    return deferred.promise;
  };
}

function processQueue () {
  setTimeout(function () {
    if (_queue.length) {
      var text = _queue.shift();
      var to = text.to;
      var message = text.message;
      _provider.text(_from, to, message)
      .then(function () {
        var record = _storage.createRecord('Text');
        return record.update({
          from: _from,
          to: to,
          message: message
        });
      })
      .then(function (record) {
        text.deferred.resolve(record);
        processQueue();
      })
      .catch(function (err) {
        text.deferred.reject(err);
        processQueue();
      });
    } else {
      processQueue();
    }
  }, 1000);
}

processQueue();

module.exports = PhoneService;
