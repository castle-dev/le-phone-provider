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
    return promise = service.text('1011011010', 'Hello')
    .then(function () {
      expect(mockProvider.text.callCount).to.equal(1);
    });
  });
  it('should only send one text per second', function (done) {
    this.timeout(4000);
    mockProvider =  { text: sinon.stub().resolves() };
    service = new PhoneService(mockProvider, mockStorage, from);
    expect(mockProvider.text.callCount).to.equal(0);
    var text1 = { to: '1011011010', message: 'Hello' };
    var text2 = { to: '0110101011', message: 'World' };
    var text3 = { to: '1011101010', message: ':]' };
    var promise1 = service.text(text1.to, text1.message);
    var promise2 = service.text(text2.to, text2.message);
    var promise3 = service.text(text3.to, text3.message);
    setTimeout(function () {
      var resolves = [];
      expect(promise1).to.have.been.resolved;
      expect(promise2).not.to.have.been.resolved;
      expect(promise3).not.to.have.been.resolved;
      expect(mockProvider.text.callCount).to.equal(1);
      expect(mockProvider.text).to.have.been.calledWith(from, text1.to, text1.message);
    }, 1500);
    setTimeout(function () {
      expect(promise1).to.have.been.resolved;
      expect(promise2).to.have.been.resolved;
      expect(promise3).not.to.have.been.resolved;
      expect(mockProvider.text.callCount).to.equal(2);
      expect(mockProvider.text).to.have.been.calledWith(from, text2.to, text2.message);
    }, 2500)
    setTimeout(function () {
      expect(promise1).to.have.been.resolved;
      expect(promise2).to.have.been.resolved;
      expect(promise3).to.have.been.resolved;
      expect(mockProvider.text.callCount).to.equal(3);
      expect(mockProvider.text).to.have.been.calledWith(from, text3.to, text3.message);
      done();
    }, 3500)
  });
});
