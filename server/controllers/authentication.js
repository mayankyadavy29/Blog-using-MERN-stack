const jwt = require('jwt-simple');
const passport = require('passport');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user._id, iat: timestamp }, config.secret);
  
}

 * @param req
 * @param res
 * @param next
 */
exports.signup = function(req, res, next) {

  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  if (!email || !password) {
    return res.status(422).send({ message: 'You must provide both email and password.' }); 
  }

  User.findOne({ email: email }, function(err, existingUser) {

    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(422).send({ message: 'This email is in use.' }); 
    }

    const user = new User({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });

    user.save(function(err) { 
      if (err) {
        return next(err);
      }

      res.json({ message: 'You have successfully signed up. You can sign in now.' });
    });
  });
};


 * @param req
 * @param res
 * @param next
 */
exports.signin = function(req, res, next) {


  res.send({
    token: tokenForUser(req.user),
    username: req.user.firstName + ' ' + req.user.lastName,
  });
};



/**
 * Verify if the JWT in local storage is valid
 *
 * @param req
 * @param res
 * @param next
 */
exports.verifyJwt = function(req, res, next) {


  res.send({
    username: req.user.firstName + ' ' + req.user.lastName
  });
};