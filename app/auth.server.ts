import { redirect } from "@remix-run/node";
import { getAuthSession } from "~/sessions.server";

export async function getCurrentUser(request: Request) {
  let cookieHeader = request.headers.get("cookie");
  let session = await getAuthSession(cookieHeader);
  let user = session.get("user");

  if (user === undefined) return null;

  return user;
}

export async function requireLoggedOutUser(request: Request) {
  let user = await getCurrentUser(request);
  if (user !== null) {
    throw redirect("/protected");
  }
}

export async function requireLoggedInUser(request: Request) {
  let user = await getCurrentUser(request);
  if (user === null) {
    throw redirect("/sign-in");
  }
  return user;
}
