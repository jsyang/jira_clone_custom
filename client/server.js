const express = require('express');
const fallback = require('express-history-api-fallback');
const compression = require('compression');
const basicAuth = require('express-basic-auth');

const app = express();

app.use(compression());

app.use(express.static(`${__dirname}/build`));

app.use(fallback(`${__dirname}/build/index.html`));

// jsyang: use basic auth to secure everything
if (process.env.NODE_ENV === 'production') {
  app.use(
    basicAuth({
      users: { skytrak2: 'proposalbeingconsidered' },
    }),
  );
}

app.listen(process.env.PORT || 8081);
