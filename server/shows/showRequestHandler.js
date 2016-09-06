var Show = require('./showModel.js');
var helpers = require('./helpers.js');

function addNewShow(req, res, next) {
  var searchQuery = req.body.searchQuery;
  var showId;
  var token;

  helpers.getToken()
    .then(function(returnedToken) {
      token = returnedToken;
      return token;
    })
    .then(function() {
      return helpers.searchForShow(searchQuery, token);
    })
    .then(function(id) {
      showId = id;
    })
    .then(function() {
      return helpers.checkForShowInDb(showId);
    })
    .then(function(found) {
      if (found) {
        res.status(200).send(found);
        throw new Error('this show is already in the database');
      }
      return showId;
    })
    .then(function() {
      return helpers.getShowInfo(showId, token);
    })
    .then(function(showInfo) {
      return helpers.addShowToDb(showInfo);
    })
    .then(function(show) {
      res.status(200).send(show);
    })
    .catch(function(err) {
      console.log(err);
    });
}

function getShows(req, res, next) {
  var query = Show.find();

  query.exec(function(err, shows) {
    if (err) return next(err);
    res.status(200).send(shows);
  });
}

function removeShow(req, res, next) {
  console.log(req.params);
  var query = Show.find({ _id: req.params.id });

  query.remove()
    .exec(function(err, show) {
      if (err) return next(err);
      res.status(200).send(show);
    });
}

function updateShow(req, res, next) {
  var query = Show.find({ _id: req.params.id });

  if (req.body.rating) {
    query.update({ rating: req.body.rating })
      .exec(function(err, show) {
        if (err) return next(err);
        res.status(200).send(show);
      });
  }
}

module.exports = {
  addNewShow: addNewShow,
  getShows: getShows,
  removeShow: removeShow,
  updateShow: updateShow
};
