# `jira_clone` Customized

## `jsyang` Changes

Do a search within codebase for `jsyang` for major / notable additions.

### Client changes

- Removed NavbarLeft
- Renamed "Selected for Development" to "Ready for Development"
- Added tooltips for date texts throughout app
- Removed AboutTooltip in favor of custom link to launch project
- Removed Breadcrumbs from Board and Settings
- Changed title from "Jira Clone" to "Project Tracker"
- Added SHORTKEY + ENTER as a KB hotkey for any textarea / rich text component
- Added ENTER autoFocused button for ConfirmModal
- Assume UTC for time display (e.g. XXX hours ago) due to SQLite not having a native DATETIME column type
- expose `privilegeLevel` from currentUser hook
- `privilegeLevel` 0 is not allowed
    - access to project settings
    - to set reporter as anyone other than themselves
- Allow users to Login and Logout from SideBar
    - Added Login modal content
- Secure client with HTTP basic auth when `NODE_ENV=production`
- Add Quill editor image uploader
- Remove Atlassian link from 404 page and change the wallpaper
- Added Quill editor Markdown shortcuts so that descriptions can be easily formatted via KB

### API changes

- use SQLite instead of PostgreSQL to remove a remote dependency
- added `privilegeLevel` to User (lower is less power)
- added AVATAR_URL_UNKNOWN for Guest user
- ensure issue search works for SQLite
- added a new `NotPermittedError`
- privilegeLevel 0 is not allowed to
    - update issues, projects
    - delete comments
- prevent users from deleting comments from other users
- added `/authentication/login`
- added `password` to User (just plaintext is enough, not super critical to hash)
- removed Comment, Issue seeds for DB
- ensure DB is only seeded if no Project / User tables have no rows
- ensure Users table is seeded in correct order
- ensure pm2 for client doesn't start pointing to `jira_clone` demo API server!
- Add `skytrak2.conf` for `nginx.conf` addition 
- add `process.env.ROOT_PATH` to allow all API routes to be rewritten as sub-paths under it
    - e.g. if ROOT_PATH is `/api`, then you'll get `/api/authentication/guest`, etc.
- Add `/images/upload` to handle single image uploads for the Quill editor

### Dumb Bitnami shit

```
sudo /opt/bitnami/ctlscript.sh stop nginx

sudo /opt/bitnami/letsencrypt/lego --tls --email="jim@completed.delivery" --domains="skytrak2.completed.delivery" --path="/opt/bitnami/letsencrypt" run

sudo mv /opt/bitnami/nginx/conf/server.crt /opt/bitnami/nginx/conf/server.crt.old
sudo mv /opt/bitnami/nginx/conf/server.key /opt/bitnami/nginx/conf/server.key.old
sudo mv /opt/bitnami/nginx/conf/server.csr /opt/bitnami/nginx/conf/server.csr.old
sudo ln -sf /opt/bitnami/letsencrypt/certificates/skytrak2.completed.delivery.key /opt/bitnami/nginx/conf/server.key
sudo ln -sf /opt/bitnami/letsencrypt/certificates/skytrak2.completed.delivery.crt /opt/bitnami/nginx/conf/server.crt
sudo chown root:root /opt/bitnami/nginx/conf/server*
sudo chmod 600 /opt/bitnami/nginx/conf/server*

sudo /opt/bitnami/ctlscript.sh start nginx
```

## Original README as follows

<h1 align="center">A simplified Jira clone built with React and Node</h1>

<div align="center">Auto formatted with Prettier, tested with Cypress 🎗</div>

<h3 align="center">
  <a href="https://jira.ivorreic.com/">Visit the live app</a> |
  <a href="https://github.com/oldboyxx/jira_clone/tree/master/client">View client</a> |
  <a href="https://github.com/oldboyxx/jira_clone/tree/master/api">View API</a>
</h3>

![Tech logos](https://i.ibb.co/DVFj8PL/tech-icons.jpg)

![App screenshot](https://i.ibb.co/W3qVvCn/jira-optimized.jpg)

## What is this and who is it for 🤷‍♀️

I do React consulting and this is a showcase product I've built in my spare time. It's a very good example of modern, real-world React codebase.

There are many showcase/example React projects out there but most of them are way too simple. I like to think that this codebase contains enough complexity to offer valuable insights to React developers of all skill levels while still being _relatively_ easy to understand.

## Features

- Proven, scalable, and easy to understand project structure
- Written in modern React, only functional components with hooks
- A variety of custom light-weight UI components such as datepicker, modal, various form elements etc
- Simple local React state management, without redux, mobx, or similar
- Custom webpack setup, without create-react-app or similar
- Client written in Babel powered JavaScript
- API written in TypeScript and using TypeORM

## Setting up development environment 🛠

- Install [postgreSQL](https://www.postgresql.org/) if you don't have it already and create a database named `jira_development`.
- `git clone https://github.com/oldboyxx/jira_clone.git`
- Create an empty `.env` file in `/api`, copy `/api/.env.example` contents into it, and fill in your database username and password.
- `npm run install-dependencies`
- `cd api && npm start`
- `cd client && npm start` in another terminal tab
- App should now be running on `http://localhost:8080/`

## Running cypress end-to-end tests 🚥

- Set up development environment
- Create a database named `jira_test` and start the api with `cd api && npm run start:test`
- `cd client && npm run test:cypress`

## What's missing?

There are features missing from this showcase product which should exist in a real product:

### Migrations 🗄

We're currently using TypeORM's `synchronize` feature which auto creates the database schema on every application launch. It's fine to do this in a showcase product or during early development while the product is not used by anyone, but before going live with a real product, we should [introduce migrations](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md).

### Proper authentication system 🔐

We currently auto create an auth token and seed a project with issues and users for anyone who visits the API without valid credentials. In a real product we'd want to implement a proper [email and password authentication system](https://www.google.com/search?q=email+and+password+authentication+node+js&oq=email+and+password+authentication+node+js).

### Accessibility ♿

Not all components have properly defined [aria attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA), visual focus indicators etc. Most early stage companies tend to ignore this aspect of their product but in many cases they shouldn't, especially once their userbase starts growing.

### Unit/Integration tests 🧪

Both Client and API are currently tested through [end-to-end Cypress tests](https://github.com/oldboyxx/jira_clone/tree/master/client/cypress/integration). That's good enough for a relatively simple application such as this, even if it was a real product. However, as the app grows in complexity, it might be wise to start writing additional unit/integration tests.

## Author: Ivor Reic ✍️

- Website: https://getivor.com/
- Skype handle: ivor.reic 💬

## Contributing

I will not be accepting PR's on this repository. Feel free to fork and maintain your own version.

## License

[MIT](https://opensource.org/licenses/MIT)

<hr>

<h3>
  <a href="https://jira.ivorreic.com/">Visit the live app</a> |
  <a href="https://github.com/oldboyxx/jira_clone/tree/master/client">View client</a> |
  <a href="https://github.com/oldboyxx/jira_clone/tree/master/api">View API</a>
</h3>
