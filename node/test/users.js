var should  = require('should');
var assert  = require('assert');
var request = require('supertest');
var constants = require('../src/helpers/constants');

var app = require('../src/lib/app');

describe('Users', function() {

  var apiToken = constants.apiTokens[0];
  var user = {
    email: "testuserlive123@gmail.com",
    password: "aPassword"
  };
  var userId = '';
  before(function(done){
    request(app)
      .delete('/v1/test/users')
      .auth(constants.testToken, 'dummy')
      .expect(200, done);
  });
  beforeEach(function(){
    user = {
      email: "testuserlive123@gmail.com",
      password: "aPassword"
    };
  });
  afterEach(function(done){
    request(app)
      .delete('/v1/test/users/'+user.email)
      .auth(constants.testToken, 'dummy')
      .expect(200, done);
  });

  describe('Signup', function() {

    describe('New user with API token', function() {
      it('should not be able to access GET /VERSION/users/stories without signing up', function(done) {
        request(app)
          .get('/v1/users')
          .auth(apiToken, 'dummy')
          .expect(401, done);
      });
    });

    describe('User not signed up yet', function() {


      it('should return email does not exist', function(done) {
        request(app)
          .get('/v1/users/exists?email=testuserlive12345@gmail.com')
          .auth(apiToken, 'dummy')
          .expect(200, function(err, res) {
            var body = res.body;
            body.should.have.property('exists', false);
            done(err);
          });
      });

      it('should be able to sign up and get an authentication token returned that can access pages', function(done) {
        request(app)
          .post('/v1/users/signup')
          .auth(apiToken, 'dummy')
          .send(user)
          .expect(201, function(err, res) {
            var body = res.body;

            body.should.have.property('authToken');
            body.should.have.property('id');
            var authToken = body.authToken;
            userId = body.id;
            request(app)
              .get('/v1/users')
              .auth(apiToken, 'dummy')
              .set('x-authentication-token', authToken)
              .expect(200, done);
          });
      });

      it('should not be able to sign up without an email', function(done) {
        request(app)
          .post('/v1/users/signup')
          .auth(apiToken, 'dummy')
          .send({
            password: 'password'
          })
          .expect(400, done);
      });

      it('should not be able to sign up without a password', function(done) {
        request(app)
          .post('/v1/users/signup')
          .auth(apiToken, 'dummy')
          .send({
            email: 'testuserlive123@gmail.com'
          })
          .expect(400, done);
      });

      it('should not be able to sign up with a password less than 5 characters', function(done) {
        request(app)
          .post('/v1/users/signup')
          .auth(apiToken, 'dummy')
          .send({
            email: 'testuserlive123@gmail.com',
            password: 'pass'
          })
          .expect(400, function(err, res) {
            var body = res.body;
            body.should.have.property('error', 'Password needs to be at least 6 characters long!');
            done();
          });
      });
    });

    describe('User has signed up', function() {
      var userSignUp = {}
      , userIdStr = ''
      , userAuthTokenStr = ''
      , userPassword = ''
      , userEmail = '';

      beforeEach(function(done){
        request(app)
          .post('/v1/users/signup')
          .auth(apiToken, 'dummy')
          .send(user)
          .expect(201, function(err, res) {
            var body = res.body;
            body.should.have.property('authToken');
            body.should.have.property('id').should.not.equal(null);
            body.should.have.property('email', user.email);
            body.should.not.have.property('password');
            userSignUp = body;
            done();
          })
      });

      it('should not be able to sign up with the same email as an existing user', function(done){
        request(app)
          .post('/v1/users/signup')
          .auth(apiToken, 'dummy')
          .send(user)
          .expect(400, done);

      });

      it('should not be able to sign up with the same email as an existing user (with a different case)', function(done){
        request(app)
          .post('/v1/users/signup')
          .auth(apiToken, 'dummy')
          .send({
            email: user.email.toUpperCase(),
            password: user.password
          })
          .expect(400, done);

      });

      it('should return email does exist', function(done) {
        request(app)
          .get('/v1/users/exists?email=testuserlive123@gmail.com')
          .auth(apiToken, 'dummy')
          .expect(200, function(err, res) {
            var body = res.body;
            body.should.have.property('exists', true);
            done(err);
          });
      });

      it('should return email does exist (with a different case)', function(done) {
        request(app)
          .get('/v1/users/exists?email='+user.email.toUpperCase())
          .auth(apiToken, 'dummy')
          .expect(200, function(err, res) {
            var body = res.body;
            body.should.have.property('exists', true);
            done(err);
          });
      });

      it('should be able to access the users page with the auth token', function(done) {
        request(app)
          .get('/v1/users')
          .auth(apiToken, 'dummy')
          .set('x-authentication-token', userSignUp.authToken)
          .expect(200, done);
      });

      it('should return 440 for expired token', function(done) {
        var expiredAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0NDMyMjI1MzksImV4cCI6MTQ0MzIyMjU5OX0.mcaBev_Lf05h5a_e4tS5lnRpBbc0ydntOhhw2bKc5rQ'; // TODO
        request(app)
          .get('/v1/users')
          .auth(apiToken, 'dummy')
          .set('x-authentication-token', expiredAuthToken)
          .expect(440, done);
      });

      describe('User login', function() {
        it('should be able to login', function(done) {
          request(app)
            .post('/v1/users/login')
            .auth(apiToken, 'dummy')
            .send(user)
            .expect(200, done);
        });

        it('should be able to login (with a different case)', function(done) {
          request(app)
            .post('/v1/users/login')
            .auth(apiToken, 'dummy')
            .send({
              email: user.email.toUpperCase(),
              password: user.password
            })
            .expect(200, done);
        });

        it('should not be able to login with the wrong password', function(done) {
          request(app)
            .post('/v1/users/login')
            .auth(apiToken, 'dummy')
            .send({
              email: user.email,
              password: user.password+"extra"
            })
            .expect(400, done);
        });

        it('should not be able to login with the wrong email', function(done) {
          request(app)
            .post('/v1/users/login')
            .auth(apiToken, 'dummy')
            .send({
              email: user.email+'dfd',
              password: user.password
            })
            .expect(400, done);
        });

        it('should not be able to login with no password', function(done) {
          request(app)
            .post('/v1/users/login')
            .auth(apiToken, 'dummy')
            .send({
              email: user.email,
            })
            .expect(400, done);
        });

        it('should not be able to login with no email', function(done) {
          request(app)
            .post('/v1/users/login')
            .auth(apiToken, 'dummy')
            .send({
              password: user.password,
            })
            .expect(400, done);
        });

        it('should not be able to login with no credentials', function(done) {
          request(app)
            .post('/v1/users/login')
            .auth(apiToken, 'dummy')
            .send({})
            .expect(400, done);
        });
      });

      describe('User updating info', function() {
        var newUserInfo = {
          firstName: "anUpdatedFirstName",
          lastName: "anUpdatedLastName",
          email: "anUpdatedEmail@gmail.com",
          password: "anUpdatedPassword"
        }
        afterEach(function(done){
          request(app)
            .delete('/v1/test/users/'+newUserInfo.email)
            .auth(constants.testToken, 'dummy')
            .expect(200, done);
        });
        it('should be able to update their information', function(done) {
          var userInfo = {
            firstName: 'aFirstName',
            lastName: 'aLastName'
          }
          request(app)
            .put('/v1/users')
            .auth(apiToken, 'dummy')
            .set('x-authentication-token',userSignUp.authToken)
            .send(userInfo)
            .expect(200, function(err, res) {
              var body = res.body;
              body.should.have.property('firstName', 'aFirstName');
              body.should.have.property('lastName', 'aLastName');
              body.should.have.property('email', user.email);
              done(err);
            });
        });

        it('should not be able to update their email from the users endpoint', function(done) {
          var userInfo = {
            email: 'aNewEmail@gmail.com',
            firstName: 'aFirstName',
            lastName: 'aLastName'
          }
          request(app)
            .put('/v1/users')
            .auth(apiToken, 'dummy')
            .set('x-authentication-token',userSignUp.authToken)
            .send(userInfo)
            .expect(200, function(err, res) {
              var body = res.body;
              body.should.have.property('firstName', 'aFirstName');
              body.should.have.property('lastName', 'aLastName');
              body.should.have.property('email', user.email);
              done(err);
            });
        });

        it('should be able able to update their email from the email endpoint', function(done) {
          request(app)
            .put('/v1/users/email')
            .auth(apiToken, 'dummy')
            .set('x-authentication-token', userSignUp.authToken)
            .send(newUserInfo)
            .expect(200, function(err, res) {
              var body = res.body;
              body.should.have.property('email', newUserInfo.email);
              done(err);
            });
        });

        it('should be able to update their password from the password endpoint', function(done) {
          request(app)
            .put('/v1/users/password')
            .auth(apiToken, 'dummy')
            .set('x-authentication-token', userSignUp.authToken)
            .send(newUserInfo)
            .expect(200, done);
        });

        it('should not be able to update their password to be too short', function(done) {
          var userInfo = {
            password: ''
          }
          request(app)
            .put('/v1/users/password')
            .auth(apiToken, 'dummy')
            .set('x-authentication-token', userSignUp.authToken)
            .send(userInfo)
            .expect(400, done);
        });

        describe('User has updated all their information', function() {


          beforeEach(function(done){
            request(app)
              .put('/v1/users')
                .auth(apiToken, 'dummy')
                .set('x-authentication-token', userSignUp.authToken)
                .send(newUserInfo)
                .expect(200)
                .end(function(err, res) {
                  var body = res.body;
                  body.should.have.property('firstName', newUserInfo.firstName);
                  body.should.have.property('lastName', newUserInfo.lastName);
                  request(app)
                    .put('/v1/users/email')
                    .auth(apiToken, 'dummy')
                    .set('x-authentication-token', userSignUp.authToken)
                    .send(newUserInfo)
                    .expect(200)
                    .end(function(err, res) {
                      body = res.body;
                      body.should.have.property('email', newUserInfo.email);
                      request(app)
                        .put('/v1/users/password')
                        .auth(apiToken, 'dummy')
                        .set('x-authentication-token', userSignUp.authToken)
                        .send(newUserInfo)
                        .expect(200, done);
                    });
                });
          });

          it('should be able able to login with new credentials', function(done) {
            request(app)
              .post('/v1/users/login')
              .auth(apiToken, 'dummy')
              .send(newUserInfo)
              .expect(200, done);
          });

          it('should not be able able to login with old password', function(done) {
            request(app)
              .post('/v1/users/login')
              .auth(apiToken, 'dummy')
              .send({
                email: newUserInfo.email,
                password: user.password
              })
              .expect(400, done);
          });

          it('should not be able able to login with old email', function(done) {
            request(app)
              .post('/v1/users/login')
              .auth(apiToken, 'dummy')
              .send({
                email: user.email,
                password: newUserInfo.password
              })
              .expect(400, done);
          });
        });
      });
    });
  });
});
