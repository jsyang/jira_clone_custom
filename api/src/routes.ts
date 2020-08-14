import * as authentication from 'controllers/authentication';
import * as comments from 'controllers/comments';
import * as issues from 'controllers/issues';
import * as projects from 'controllers/projects';
import * as test from 'controllers/test';
import * as users from 'controllers/users';

export const attachPublicRoutes = (app: any): void => {
  if (process.env.NODE_ENV === 'test') {
    app.delete('/test/reset-database', test.resetDatabase);
    app.post('/test/create-account', test.createAccount);
  }

  app.post('/api/authentication/guest', authentication.createGuestAccount);
  app.post('/api/authentication/login', authentication.login); // jsyang
};

export const attachPrivateRoutes = (app: any): void => {
  app.post('/api/comments', comments.create);
  app.put('/api/comments/:commentId', comments.update);
  app.delete('/api/comments/:commentId', comments.remove);

  app.get('/api/issues', issues.getProjectIssues);
  app.get('/api/issues/:issueId', issues.getIssueWithUsersAndComments);
  app.post('/api/issues', issues.create);
  app.put('/api/issues/:issueId', issues.update);
  app.delete('/api/issues/:issueId', issues.remove);

  app.get('/api/project', projects.getProjectWithUsersAndIssues);
  app.put('/api/project', projects.update);

  app.get('/api/currentUser', users.getCurrentUser);
};
