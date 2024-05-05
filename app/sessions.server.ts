import { createCookieSessionStorage } from "@remix-run/node";

const isProduction = process.env.NODE_ENV === "production";

if (typeof process.env.SESSION_LOGIN_SECRET !== "string") {
  throw new Error("Missing env: SESSION_LOGIN_SECRET");
}

const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "remix_local__auth",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    secrets: [process.env.SESSION_LOGIN_SECRET],
    // Set domain and secure only if in production
    ...(isProduction ? { domain: "remix-local-auth.poschuler.com", secure: true } : {}),
  },
});

export const {
  getSession: getAuthSession,
  commitSession: commitAuthSession,
  destroySession: destroyAuthSession,
} = authSessionStorage;
