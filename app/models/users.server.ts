import { dbQueryRow } from "~/db.server";
import * as argon2 from "argon2";
import { randomUUID } from "crypto";

type UserRowType = {
  idUser: number;
  email: string;
  hashedPassword: string;
};

type ErrorType = {
  code: number;
  message: string;
};

export async function findUserByEmail(email: string) {
  let queryResult = await dbQueryRow<UserRowType>(
    `
        select 
        id_user as "idUser",
        email as "email",
        hashed_password as "hashedPassword"
        from users 
        where 
        email = $1
      `,
    [email]
  );

  return queryResult;
}

export async function signInLocal(email: string, password: string) {
  let success: boolean = false;
  let error = {} as ErrorType;
  let user = {} as UserRowType;

  let found = await findUserByEmail(email);

  if (!found) {
    error = {
      code: 403,
      message: "Wrong user or password",
    };

    return { success, error, data: { user } };
  }

  let passwordMatches = await argon2.verify(found.hashedPassword, password);

  if (!passwordMatches) {
    error = {
      code: 403,
      message: "Wrong user or password",
    };
    return { success, error, data: { user } };
  }

  success = true;

  return { success, error, data: { user: found } };
}

export async function createUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  let hashedPassword = await argon2.hash(password);
  let success: boolean = false;
  let error = {} as ErrorType;
  let user = {} as {
    idUser: number;
    email: string;
  };

  let foundItem = await existsUserByEmail(email);

  if (foundItem) {
    error = {
      code: 400,
      message: "User already registered",
    };

    return { success, error, data: { user } };
  }

  user = await dbQueryRow<{
    idUser: number;
    email: string;
  }>(
    `
       insert into users 
       (email, hashed_password)
       values
       ($1, $2)
       returning 
       id_user as "idUser",
       email as "email"
       `,
    [email, hashedPassword]
  );

  success = true;

  return { success, error, data: { user } };
}

export async function existsUserByEmail(email: string) {
  let queryResult = await dbQueryRow<{ count: number }>(
    `
      select 
      1 as "count"
      from users 
      where 
      email = $1 
      limit 1
    `,
    [email]
  );

  return queryResult && queryResult.count !== 0;
}
