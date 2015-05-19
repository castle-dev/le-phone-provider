var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('e2e tests::', function () {
  var validToNumber = '7852730325'; // Any valid phone number should do here
  var invalidToNumber = '5005550009'; // Provided by Twilio
  var service;
  this.timeout(10000);
  before(function () {
    var StorageService = require('le-storage-service');
    var StorageProvider = require('le-storage-provider-firebase');
    var firebaseUrl = process.env.FIREBASE_URL;
    var storage = new StorageService(new StorageProvider(firebaseUrl));
    var PhoneService = require('../../src/index.js');
    var PhoneProvider = require('le-phone-provider-twilio');
    var twilioAccountSID = process.env.TWILIO_ACCOUNT_SID;
    var twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    var from = '5005550006'; // Also provided by Twilio
    service = new PhoneService(new PhoneProvider(twilioAccountSID, twilioAuthToken), storage, from);
  });
  it('should respect logic', function () {
    expect(true).to.be.true;
    expect(true).not.to.be.false;
  });
  it('should send text messages', function () {
    var promise = service.text(validToNumber, 'Hello!')
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should not send text messages to invalid numbers', function () {
    var promise = service.text(invalidToNumber, 'Hello!')
    return expect(promise).to.eventually.be.rejected;
  });
});
