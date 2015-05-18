var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');
var sinonAsPromised = require('sinon-as-promised');
var expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

var PhoneService = require('../../src/index.js');

describe('unit tests::', function () {
  var service;
  var mockProvider =  { text: sinon.stub().resolves() };
  var mockStorage = {
    createRecord: sinon.stub().returns({
      update: sinon.stub().resolves()
    })
  };
  var from = '9188675309';
  it('should respect logic', function () {
    expect(true).to.be.true;
    expect(true).not.to.be.false;
  });
  it('should be constructable', function () {
    expect(function () {
      service = new PhoneService(mockProvider, mockStorage, from);
    }).not.to.throw();
  });
  it('should require a provider', function () {
    expect(function () {
      new PhoneService();
    }).to.throw('Phone provider required');
  });
  it('should require an instance of le-storage-service', function () {
    expect(function () {
      new PhoneService(mockProvider);
    }).to.throw('Instance of le-storage-service required');
  });
  it('should require a from phone number', function () {
    expect(function () {
      new PhoneService(mockProvider, mockStorage);
    }).to.throw('From phone number required');
  });
  it('should send and store texts', function () {
    var promise = service.text('1011011010', 'Hello')
    .then(function (record) { expect(record.update).to.have.been.called });
    expect(mockProvider.text).to.have.been.called;
    return expect(promise).to.eventually.be.fulfilled;
  });
});
