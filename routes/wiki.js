const express = require('express');
const router = express.Router();
const models = require('../models');

const Page = models.Page;
const User = models.User;

// '/wiki'
router.get('/', (req, res, next) => {
  Page.findAll({})
    .then(newPages => {
      res.render('index', {
        pages: newPages
      });
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  // TODO: Can we just use .create() here to to skip using build() and save()?
  User.findOrCreate({
      where: {
        email: req.body.authorEmail,
        name: req.body.authorName
      }
    })
    .spread((user, metadata) => { // [resolves to page found or created, bool(found | not found)]
      return Page.create({
          title: req.body.title,
          content: req.body.content,
          status: req.body.status
        })
        .then((createdPage) => {
          return createdPage.setAuthor(user); // setting authorId of page. Where does .setAuthor() come from?
        });
    })
    .then((createdPage) => {
      res.redirect(createdPage.route);
    })
    .catch(next);
    res.redirect('/');
});

// '/wiki/add'
router.get('/add', (req, res, next) => {
  res.render('addpage');
});

router.get('/:urlTitle', (req, res, next) => {
  const url = req.params.urlTitle;

  Page.findOne({
      where: {
        urlTitle: url
      }
    })
    .then(page => {
      if (!page) {
        return next(new Error("Page not found"));
      }

      return page.getAuthor()
        .then(author => {
          page.author = author;
          res.render('wikipage', {
            page: page
          });

        })
    })
    .catch(next);
});

module.exports = router;
