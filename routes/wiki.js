const express = require('express');
const router = express.Router();
const models = require('../models');

const Page = models.Page;
const User = models.User;

// '/wiki'
router.get('/', (req, res, next) => {
  Page.findAll({})
    .then(newPages => {
      res.render('index', {pages: newPages});
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  // TODO: Can we just use .create() here to to skip using build() and save()?
  const page = Page.build({
    title: req.body.title,
    content: req.body.content,
    status: req.body.status,
    date: new Date()
  });

  page.save()
    .then(() => res.redirect(`/wiki/${page.urlTitle}`))
    .catch((err) => next(err));

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
      res.render('wikipage', {
        page: page
      });
    })
    .catch(err => next(err));
});

module.exports = router;
