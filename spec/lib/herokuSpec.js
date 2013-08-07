var client       = require('../../lib/request'),
    herokuModule = require('../../lib/heroku'),
    heroku       = new herokuModule.Heroku({ key: '12345' });

describe('Heroku', function() {
  beforeEach(function() {
    spyOn(client, 'request').andCallFake(function(path, options, callback) {
      callback();
    });
  });

  describe('requests with no body', function() {
    it('can perform a request with no parameters', function(done) {
      heroku.app.list(function() {
        expect(client.request.mostRecentCall.args[0]).toEqual('/apps');
        done();
      });
    });

    it('can perform a request with one parameter', function(done) {
      heroku.app.info('my-app', function() {
        expect(client.request.mostRecentCall.args[0]).toEqual('/apps/my-app');
        done();
      });
    });

    it('can perform a request with multiple parameters', function(done) {
      heroku.collaborator.info('my-app', 'jonathan@heroku.com', function() {
        expect(client.request.mostRecentCall.args[0]).toEqual('/apps/my-app/collaborators/jonathan@heroku.com');
        done();
      });
    });
  });

  describe('requests with a body and no parameters', function() {
    it('requests the correct path', function(done) {
      heroku.app.create({ name: 'my-app' }, function() {
        expect(client.request.mostRecentCall.args[0]).toEqual('/apps');
        done();
      });
    });

    it('sends the request body', function(done) {
      heroku.app.create({ name: 'my-new-app' }, function() {
        expect(client.request.mostRecentCall.args[1].body).toEqual({ name: 'my-new-app' });
        done();
      });
    });
  });

  describe('requests with a body and one parameter', function() {
    it('requests the correct path', function(done) {
      heroku.addOn.create('my-app', { name: 'papertrail:choklad' }, function() {
        expect(client.request.mostRecentCall.args[0]).toEqual('/apps/my-app/addons');
        done();
      });
    });

    it('sends the request body', function(done) {
      heroku.addOn.create('my-app', { name: 'papertrail:choklad' }, function() {
        expect(client.request.mostRecentCall.args[1].body).toEqual({ name: 'papertrail:choklad' });
        done();
      });
    });
  });

  describe('requests with a body and multiple parameters', function() {
    it('requests the correct path', function(done) {
      heroku.addOn.update('my-app', 'papertrail:choklad', { name: 'papertrail:fixa' }, function() {
        expect(client.request.mostRecentCall.args[0]).toEqual('/apps/my-app/addons/papertrail:choklad');
        done();
      });
    });

    it('sends the request body', function(done) {
      heroku.addOn.update('my-app', 'papertrail:choklad', { name: 'papertrail:fixa' }, function() {
        expect(client.request.mostRecentCall.args[1].body).toEqual({ name: 'papertrail:fixa' });
        done();
      });
    });
  });
});
