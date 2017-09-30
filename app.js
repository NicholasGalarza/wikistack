const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const path = require('path');
const nunjucks = require('nunjucks');
const wikiRouter = require('./routes/wiki');
const usersRouter = require('./routes/users');
const models = require('./models');

const Page = models.Page;
const User = models.User;
const PORTNUM = 3000;

// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);
// have res.render work with html files
app.set('view engine', 'html');
nunjucks.configure('views', {
  noCache: true
});
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
  extended: true
})); // HTML form submits.
app.use(bodyParser.json()); // ajax req.
app.use(express.static(path.join(__dirname, '/public')));

// Set first param of wikiRouter middleware to '/wiki' to natively point to that
// endpoint.
app.use('/wiki', wikiRouter);
app.use('/users', usersRouter); 

app.get('/', (req, res) => {
  res.render('index');
});

User.sync({
    force: true
  })
  .then(() => {
    return Page.sync({
      force: true
    });
  })
  .then(() => {
    app.listen(PORTNUM, () => {
      console.log(`Listening on port ${PORTNUM}`)
    });
  })
  .catch(console.error);

// Express Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || "Internal Error");
});
