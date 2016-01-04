# serve-webpack-client

Helper module for serving webpack-related client code from a nodejs server.

[Webpack](http://webpack.github.io) is a great tool. So is
[Express](http://expressjs.com).

However using them together took some thinking given that I typically:

* serve single-page applications (e.g. in ReactJS or AngularJS)
* want to use the HTML5 history API to avoid the ugly '#' in my URLs.
* want to use an express server to serve up both the client and a backend REST API.
* want the express server configured to handle deep-linking for my app's routes
* want to serve the app from static files in production, but from Webpack's watcher
when I'm in developer mode.

This module is the special sauce I need to do all this stuff at once.

## Installation

Get it from npm:

```sh
npm install --save serve-webpack-client
```

## Code

Use it like this (server.js):

```javascript
const serveWebpackClient = require('serve-webpack-client');

const app = express();

// configure your REST API routes here as normal.

// Now set up the client to serve itself:
app.use(serveWebpackClient({
  distPath: path.join(__dirname, '/dist'), // Used in prod
  indexFileName: 'index.html',
  webpackConfig: require('/webpack.config') // Used for dev.
}));

app.listen(3000);
```

## Run in dev mode:

```sh
nodemon server.js
```

This will monitor your server source code for changes and refresh; it will also
use [webpack-dev-middleware](https://www.npmjs.com/package/webpack-dev-middleware)
to monitor your client assets and refresh.

Your app will be served from `domain/index.html` or domain/your/arbitrary/path/index.html`
to allow for deep linking to single-page app routes.

## Run in prod mode:

```sh
webpack -p # build your client to /dist as static files

NODE_ENV=production node server.js
```

When `NODE_ENV === 'production'`, `webpack-dev-middleware` is not used.  Instead
we use `express.static` to serve whatever you previously built out to the `/dist`
folder.
