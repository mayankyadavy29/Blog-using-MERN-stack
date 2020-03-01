const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

/**
 * Fetch profile information
 *
 * @param req
 * @param res
 * @param next
 */
exports.fetchProfile = function(req, res, next) {

  const user = ({
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    birthday: req.user.birthday,
    sex: req.user.sex,
    phone: req.user.phone,
    address: req.user.address,
    occupation: req.user.occupation,
    description: req.user.description,
  });
  res.send({
    user: user
  });
};

/**
 * Update profile information
 *
 * @param req
 * @param res
 * @param next
 */
exports.updateProfile = function(req, res, next) {


  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const birthday = req.body.birthday;
  const sex = req.body.sex;
  const phone = req.body.phone;
  const address = req.body.address;
  const occupation = req.body.occupation;
  const description = req.body.description;

  const user = req.user;

  Post.updateMany({ authorId: user._id }, { $set: { authorName: firstName + ' ' + lastName }}, function(err) {
    if (err) {
      next(err);
    }
  });

  Comment.updateMany({ authorId: user._id }, { $set: { authorName: firstName + ' ' + lastName }}, function(err) {
    if (err) {
      next(err);
    }
  });
  
  User.findByIdAndUpdate(user._id, { $set: {
    firstName: firstName,
    lastName: lastName,
    birthday: birthday,
    sex: sex,
    phone: phone,
    address: address,
    occupation: occupation,
    description: description,
  } }, { new: true }, function(err, updatedUser) {
    if (err) {
      return next(err);
    }
    updatedUser = updatedUser.toObject();
    delete updatedUser['_id'];
    delete updatedUser['password'];
    delete updatedUser['__v'];
    res.send({ user: updatedUser });
  })
};

/**
 * Reset password
 *
 * @param req
 * @param res
 * @param next
 */
exports.resetPassword = function(req, res, next) {

  // Require auth

  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const user = req.user;

  user.comparePassword(oldPassword, function(err, isMatch) {

    if (err) {
      return next(err);
    }

    if (!isMatch) {
      return res.status(422).send({ message: 'You old password is incorrect! Please try again.' })
    }

    if (oldPassword === newPassword) {
      return res.status(422).send({ message: 'Your new password must be different from your old password!' });
    }
    
    user.password = newPassword;

    user.save(function(err) {
      if (err) {
        return next(err);
      }

      res.json({ message: 'You have successfully updated your password.' });
    });
  });
};