import { catchErrors, InvalidCredentialsError } from 'errors';
import { User } from 'entities';
import { signToken } from 'utils/authToken';
import createAccount from 'database/createGuestAccount';
import { findEntityByParamsOrThrow } from 'utils/typeorm';

export const createGuestAccount = catchErrors(async (_req, res) => {
  const user = await createAccount();
  res.respond({
    authToken: signToken({ sub: user.id }),
  });
});

export const login = catchErrors(async (_req, res) => {
  const user = await findEntityByParamsOrThrow(User, { email: _req.body.email } as any);

  if (user.password !== _req.body.password) {
    throw new InvalidCredentialsError();
  }

  res.respond({
    authToken: signToken({ sub: user.id }),
  });
});
