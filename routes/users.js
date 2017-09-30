
const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;
const Promise = require('bluebird');
module.exports = router;

// GET /users
router.get('/', (req, res, next) => {
  User.findAll()
    .then(users => {
      res.render('users', {
        users: users
      });
    })
    .catch(next);
  });

router.get('/:userId', (req, res, next) => {
  let findingUserPages = Page.findAll({
    where: {
      authorId: req.params.userId
    }
  });

  let findingUser = User.findById(req.params.userId)
  Promise.all([
    findingUserPages, findingUser
  ])
  .then((values) => {
    let pages = values[0],
        user = values[1];

    user.pages = pages;

    res.render('userpage', {
      user: user
    });
  })
  .catch(next);
})
