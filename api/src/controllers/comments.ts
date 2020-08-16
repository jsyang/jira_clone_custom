import { Comment, Issue } from 'entities';
import { sendMessage, CLIENT_URL, escapeText } from 'utils/slack';
import { catchErrors, NotPermittedError } from 'errors';
import { updateEntity, deleteEntity, createEntity, findEntityOrThrow } from 'utils/typeorm';

export const create = catchErrors(async (req, res) => {
  const comment = await createEntity(Comment, req.body);

  const { body, issueId } = req.body;
  const foundIssue = await findEntityOrThrow(Issue, issueId);

  sendMessage([
    `*${escapeText(req.currentUser.name)}*`,
    ` posted a comment on `,
    `<${CLIENT_URL}/project/board/issues/${issueId}|${escapeText(foundIssue.title)}>:\n\n>`,
    escapeText(body),
  ]);

  res.respond({ comment });
});

export const update = catchErrors(async (req, res) => {
  const comment = await updateEntity(Comment, req.params.commentId, req.body);

  const { body, issueId } = req.body;
  const foundIssue = await findEntityOrThrow(Issue, issueId);
  sendMessage([
    `*${escapeText(req.currentUser.name)}*`,
    ` updated a comment on `,
    `<${CLIENT_URL}/project/board/issues/${issueId}|${escapeText(foundIssue.title)}>:\n\n>`,
    escapeText(body),
  ]);

  res.respond({ comment });
});

export const remove = catchErrors(async (req, res) => {
  // jsyang: Don't allow deleting of other users' comments. just your own, unless you're a guest
  const foundComment = await findEntityOrThrow(Comment, req.params.commentId);
  if (req.currentUser.id !== foundComment.userId) {
    throw new NotPermittedError();
  }

  const { issueId } = foundComment;
  const foundIssue = await findEntityOrThrow(Issue, issueId);
  sendMessage([
    `*${escapeText(req.currentUser.name)}*`,
    ` deleted a comment on `,
    `<${CLIENT_URL}/project/board/issues/${issueId}|${escapeText(foundIssue.title)}>.`,
  ]);

  const comment = await deleteEntity(Comment, req.params.commentId);
  res.respond({ comment });
});
