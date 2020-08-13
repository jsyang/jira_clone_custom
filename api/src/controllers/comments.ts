import { Comment } from 'entities';
import { catchErrors, NotPermittedError } from 'errors';
import { updateEntity, deleteEntity, createEntity, findEntityOrThrow } from 'utils/typeorm';

export const create = catchErrors(async (req, res) => {
  const comment = await createEntity(Comment, req.body);
  res.respond({ comment });
});

export const update = catchErrors(async (req, res) => {
  const comment = await updateEntity(Comment, req.params.commentId, req.body);
  res.respond({ comment });
});

export const remove = catchErrors(async (req, res) => {
  // jsyang: Don't allow deleting of other users' comments. just your own, unless you're a guest
  const foundComment = await findEntityOrThrow(Comment, req.params.commentId);
  if (req.currentUser.id !== foundComment.userId) {
    throw new NotPermittedError();
  }

  const comment = await deleteEntity(Comment, req.params.commentId);
  res.respond({ comment });
});
