const express = require('express');
const router = express.Router();
const models = require('../models');

const Page = models.Page;
const User = models.User;

router.get('/', (req, res, next) => {
  Page.findAll({})
    .then(pagesObj => {
      res.render('index', {
        pages: pagesObj
      });
    })
    .catch(next);
    
  res.redirect('/');
});

router.post('/', (req, res, next) => {
  //res.send(`submit a new page to the database`);
  const page = Page.build({
    title: req.body.title,
    content: req.body.content,
    status: req.body.status,
    date: new Date()
  });

  page.save()
    .then(() => console.log('Page save has been succesful'))
    .catch(next);

  res.redirect('/');
});

router.get('/add', (req, res, next) => {
  //res.send(`retrieve the "add a page" form`);
  res.render('addpage');
  // res.redirect('/');
});

router.get(':urlTitle', (req, res, next) => {
  const url = req.params.urlTitle;

  Page.findOne({
    where: {
      urlTitle: url
    }
  }).then(page => {
    if (!page) {
      return next(new Error("Page not found"));
    }
    res.render('wikipage', {
      page: page
    });
  }).catch(next);
});



module.exports = router;
