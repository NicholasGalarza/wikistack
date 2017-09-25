const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const path = require('path');
const nunjucks = require('nunjucks');
const routes = require('./routes');
const models = require('./models');

const PORTNUM = 3000;

// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);
// have res.render work with html files
app.set('view engine', 'html');
nunjucks.configure('views', {
  noCache: true
});
app.use(morgan('dev'));


app.use(bodyParser.urlencoded({extended: true})); // HTML form submits.
app.use(bodyParser.json()); // ajax req.
app.use(express.static(path.join(__dirname, '/public')));

// Express Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.use(routes);

models.db.sync({force: true })
  .then(() => {
    app.listen(PORTNUM, () => {
      console.log(`Listening on port ${PORTNUM}`);
    });
  })
  .catch(console.error);

  // db.get(urlTitle)
