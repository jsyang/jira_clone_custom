import { Issue } from 'entities';
import { catchErrors, NotPermittedError } from 'errors';
import { updateEntity, deleteEntity, createEntity, findEntityOrThrow } from 'utils/typeorm';
import { CLIENT_URL, escapeText, sendMessage } from 'utils/slack';

export const getProjectIssues = catchErrors(async (req, res) => {
  const { projectId } = req.currentUser;
  const { searchTerm } = req.query;

  let whereSQL = 'issue.projectId = :projectId';

  if (searchTerm) {
    // PostgreSQL specific (ILIKE): whereSQL += ' AND (issue.title ILIKE :searchTerm OR issue.descriptionText ILIKE :searchTerm)';
    // jsyang: SQLite LIKE is already case-insensitive
    // https://www.sqlitetutorial.net/sqlite-like/
    whereSQL += ' AND (issue.title LIKE :searchTerm OR issue.descriptionText LIKE :searchTerm)';
  }

  const issues = await Issue.createQueryBuilder('issue')
    .select()
    .where(whereSQL, { projectId, searchTerm: `%${searchTerm}%` })
    .getMany();

  res.respond({ issues });
});

export const getIssueWithUsersAndComments = catchErrors(async (req, res) => {
  const issue = await findEntityOrThrow(Issue, req.params.issueId, {
    relations: ['users', 'comments', 'comments.user'],
  });
  res.respond({ issue });
});

// jsyang: All users can create issues, hide this entire project tracker behind HTTP basic auth to avoid public use
export const create = catchErrors(async (req, res) => {
  const listPosition = await calculateListPosition(req.body);
  const issue = await createEntity(Issue, { ...req.body, listPosition });

  sendMessage(
    [
      `*${escapeText(req.currentUser.name)}* created `,
      `<${CLIENT_URL}/project/board/issues/${issue.id}|${escapeText(issue.title)}>.`,
    ],
    ':memo:',
  );

  res.respond({ issue });
});

export const update = catchErrors(async (req, res) => {
  if (req.currentUser.privilegeLevel === 0) {
    throw new NotPermittedError();
  }

  const issue = await updateEntity(Issue, req.params.issueId, req.body);

  sendMessage(
    [
      `*${escapeText(req.currentUser.name)}* updated `,
      `<${CLIENT_URL}/project/board/issues/${issue.id}|${escapeText(issue.title)}>.`,
    ],
    ':memo:',
  );

  res.respond({ issue });
});

export const remove = catchErrors(async (req, res) => {
  if (req.currentUser.privilegeLevel === 0) {
    throw new NotPermittedError();
  }

  const foundIssue = await findEntityOrThrow(Issue, req.params.issueId);
  sendMessage(
    [
      `*${escapeText(req.currentUser.name)}* deleted `,
      `<${CLIENT_URL}/project/board/issues/${foundIssue.id}|${escapeText(foundIssue.title)}>.`,
    ],
    ':wastebasket:',
  );

  const issue = await deleteEntity(Issue, req.params.issueId);
  res.respond({ issue });
});

const calculateListPosition = async ({ projectId, status }: Issue): Promise<number> => {
  const issues = await Issue.find({ projectId, status });

  const listPositions = issues.map(({ listPosition }) => listPosition);

  if (listPositions.length > 0) {
    return Math.min(...listPositions) - 1;
  }
  return 1;
};
