import { Project } from 'entities';
import { catchErrors, NotPermittedError } from 'errors';
import { findEntityOrThrow, updateEntity } from 'utils/typeorm';
import { issuePartial } from 'serializers/issues';
import { escapeText, sendMessage } from 'utils/slack';

export const getProjectWithUsersAndIssues = catchErrors(async (req, res) => {
  const project = await findEntityOrThrow(Project, req.currentUser.projectId, {
    relations: ['users', 'issues'],
  });
  res.respond({
    project: {
      ...project,
      issues: project.issues.map(issuePartial),
    },
  });
});

export const update = catchErrors(async (req, res) => {
  if (req.currentUser.privilegeLevel === 0) {
    throw new NotPermittedError();
  }

  const project = await updateEntity(Project, req.currentUser.projectId, req.body);
  sendMessage(
    [
      `*${escapeText(req.currentUser.name)}* updated details for `,
      `*${escapeText(project.name)}*.`,
    ],
    ':writing_hand:',
  );

  res.respond({ project });
});
