let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let glob = require('glob');
let path = require('path');

let configuration = require('./configuration.js');

let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'pug');

app.use(require('./src/middleware/database.js'));
app.use(require('./src/middleware/stores.js'));

const HTTP_METHODS = require('http').METHODS.map(method => method.toLowerCase());

// Here be dragons.  We're monkey patching express.js to make it correctly handle errors thrown from async functions.
(function () {
  const patch = (expressObject) => {
    for (const functionToPatch of HTTP_METHODS.concat(['use'])) {
      let originalFunction = expressObject[functionToPatch];

      expressObject[functionToPatch] = function (...args) {
        for (let i = 0; i < args.length; i++) {
          if (typeof args[i] === 'function') {
            let originalHandler = args[i];
            args[i] = (...args2) => Promise.resolve(originalHandler(...args2)).catch(args2[2]);
          }
        }

        return originalFunction.apply(expressObject, args);
      };
    }

    return expressObject;
  };

  patch(app);

  let originalRouter = express.Router;
  express.Router = (...args) => patch(originalRouter(...args));
})();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' });
});

glob('./src/controllers/**/*.js', {}, (err, files) => {
  if (err != null) {
    console.error(`Error while loading controllers: ${err}`);
    return;
  }

  for (const controllerFile of files) {
    app.use(require(controllerFile));
  }
});

app.use(require('./src/middleware/errorHandling.js'));

app.listen(configuration.server.port, () => console.log(`Server listening on port ${configuration.server.port}`));
