const express = require('express');
const hbs = require('express-handlebars');
const session = require('express-session');

const initDb = require('./models/index');

const carsService = require('./util/cars');
const accessoryService = require('./util/accessory');
const authService = require('./util/auth');

const { home } = require('./controllers/home');
const { about } = require('./controllers/about');
const create = require('./controllers/create');
const { details } = require('./controllers/details');
const deleteCar = require('./controllers/erase');
const edit = require('./controllers/edit');
const accessory = require('./controllers/accessory');
const auth = require('./controllers/auth');

const { notFound404 } = require('./controllers/notFound');
const attach = require('./controllers/attach');
const { isLoggedIn } = require('./util/common');

start();

async function start() {
  await initDb();

  const app = express();

  app.engine(
    'hbs',
    hbs.create({
      extname: '.hbs',
    }).engine
  );

  app.set('view engine', 'hbs');

  app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: 'auto' },
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use('/static', express.static('static'));
  app.use(carsService());
  app.use(accessoryService());
  app.use(authService());

  app.get('/', home);
  app.get('/about', about);
  app.get('/details/:id', details);

  app
    .route('/create')
    .get(isLoggedIn(), create.get)
    .post(isLoggedIn(), create.post);

  app
    .route('/erase/:id')
    .get(isLoggedIn(), deleteCar.get)
    .post(isLoggedIn(), deleteCar.post);

  app
    .route('/edit/:id')
    .get(isLoggedIn(), edit.get)
    .post(isLoggedIn(), edit.post);

  app
    .route('/accessory')
    .get(isLoggedIn(), accessory.get)
    .post(isLoggedIn(), accessory.post);

  app
    .route('/attach/:id')
    .get(isLoggedIn(), attach.get)
    .post(isLoggedIn(), attach.post);

  app.route('/register').get(auth.registerGet).post(auth.registerPost);
  app.route('/login').get(auth.loginGet).post(auth.loginPost);
  app.route('/logout').get(auth.logout);

  app.all('*', notFound404);

  app.listen(3000, () => console.log(`Server started on port 3000`));
}
