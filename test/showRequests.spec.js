 var request = require('supertest-as-promised');
 var express = require('express');
 var expect = require('chai').expect;
 var app = require('../server/server.js').app;

 var db = require('../server/server.js').db;
 var Show = require('../server/shows/show-model.js');
 var helpers = require('../server/shows/helpers.js');
 var key = require('../server/config/keys.js').TVDB.API_KEY;

 // TODO: refactor using promises
 describe('Fetching shows: ', function() {
   var shows = [
     {_id: 999998, name: 'Some Show', genre: 'someGenre'},
     {_id: 999999, name: 'Some Other Show', genre: 'otherGenre'},
     {_id: 1000000, name: 'Random Show', genre: 'someGenre'}
   ];

   before(function(done) {
     shows.forEach(function(show) { Show.create(show) });
     done();
   });

   after(function(done) {
     shows.forEach(function(show) { Show.remove(show).exec() });
     done();
   });

   it('Returns shows based on genre queried', function(done) {
     var expected = [
       {__v: 0, _id: 999998, episodes: [], name: 'Some Show', subscribers: [], genre: ['someGenre']},
       {__v: 0, _id: 1000000, episodes: [], name: 'Random Show', subscribers: [], genre: ['someGenre']}
     ];

     request(app)
       .get('/api/shows')
       .query({ 'genre': 'someGenre' })
       .expect(function(res) {
         expect(res.body).to.eql(expected);
       })
       .expect(200)
       .end(done);
   });

   it('Returns show based on ID', function(done) {
     var expected = {__v: 0, _id: 1000000, episodes: [], name: 'Random Show', subscribers: [], genre: ['someGenre']};

     request(app)
       .get('/api/shows/1000000')
       .expect(function(res) {
         expect(res.body).to.eql(expected);
       })
       .expect(200)
       .end(done);
   });
 });

 describe('Adding new show: ', function() {
   var uri = 'https://api.thetvdb.com';
   var episodeId = 2075261;
   var showName = 'Pretty Little Liars';
   var showId = 146711;
   var token;

   before(function(done) {
     request(uri)
       .post('/login')
       .send({apikey: key})
       .then(function(res) {
         token = res.body.token;
       })
       .then(function() {
         done();
       })
       .catch(function(err) {
         console.log('error: ', err);
         done();
       });
   });

   it('Be able to search TVDB for a show by name', function(done) {
     helpers.searchForShow(showName, token)
       .then(function(id) {
         expect(id).to.equal(showId);
         done();
       })
       .catch(function(err) {
         console.log('error: ', err);
         done();
       });
   });

   it('Be able to check if a show is already in the DB', function(done) {
     var show = {_id: 999998, name: 'Some Show', genre: 'someGenre'};
     // TODO: use promise library for mongoose query
     Show.create(show)
       .then(function(show) {
         return helpers.checkForShowInDb(show._id);
       })
       .then(function(result) {
         expect(result).to.equal(show._id);
         done();
       })
       .catch(function(err) {
         console.log('error: ', err);
         done();
       });
   });

   it('Be able to fetch show info by show ID', function(done) {
     helpers.getShowInfo(showId, token)
       .then(function(showData) {
         expect(showData.id).to.equal(showId);
         done();
       })
       .catch(function(err) {
         console.log('error: ', err);
         done();
       });
   });

   it('Be able to fetch episodes of a show by show ID', function(done) {
     helpers.getEpisodes(showId, token)
       .then(function(episodes) {
         expect(episodes[0].episodeName).to.equal('Pilot');
         done();
       })
       .catch(function(err) {
         console.log('error: ', err);
         done();
       });
   });

 });