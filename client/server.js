const express = require('express');
const fallback = require('express-history-api-fallback');
const compression = require('compression');
const basicAuth = require('express-basic-auth');

const app = express();

// jsyang: use basic auth to secure everything
app.use(
  basicAuth({
    users: { skytrak2: 'proposalbeingconsidered' },
    challenge: true,
    realm: 'SkyTrak2 Project Tracker',
  }),
);

app.use(compression());

// Need to try serving files first, otherwise the 404 page will catch any file requests
app.use(express.static(`${__dirname}/files`));

app.use(express.static(`${__dirname}/build`));
app.use(fallback(`${__dirname}/build/index.html`));

app.listen(process.env.PORT || 8081);
