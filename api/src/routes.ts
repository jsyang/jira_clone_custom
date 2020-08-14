import * as authentication from 'controllers/authentication';
import * as comments from 'controllers/comments';
import * as issues from 'controllers/issues';
import * as projects from 'controllers/projects';
import * as users from 'controllers/users';

const { ROOT_PATH = '' } = process.env;

export const attachPublicRoutes = (app: any): void => {
  app.post(`${ROOT_PATH}/authentication/guest`, authentication.createGuestAccount);
  app.post(`${ROOT_PATH}/authentication/login`, authentication.login); // jsyang
};

export const attachPrivateRoutes = (app: any): void => {
  app.post(`${ROOT_PATH}/comments`, comments.create);
  app.put(`${ROOT_PATH}/comments/:commentId`, comments.update);
  app.delete(`${ROOT_PATH}/comments/:commentId`, comments.remove);

  app.get(`${ROOT_PATH}/issues`, issues.getProjectIssues);
  app.get(`${ROOT_PATH}/issues/:issueId`, issues.getIssueWithUsersAndComments);
  app.post(`${ROOT_PATH}/issues`, issues.create);
  app.put(`${ROOT_PATH}/issues/:issueId`, issues.update);
  app.delete(`${ROOT_PATH}/issues/:issueId`, issues.remove);

  app.get(`${ROOT_PATH}/project`, projects.getProjectWithUsersAndIssues);
  app.put(`${ROOT_PATH}/project`, projects.update);

  app.get(`${ROOT_PATH}/currentUser`, users.getCurrentUser);
};
