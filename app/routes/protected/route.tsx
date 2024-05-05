import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { redirectWithSuccess } from "remix-toast";
import { z } from "zod";
import { requireLoggedInUser } from "~/auth.server";
import Layout from "~/components/layout";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { destroyAuthSession, getAuthSession } from "~/sessions.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireLoggedInUser(request);
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let _action = z.string().parse(formData.get("_action"));

  if (_action === "logOut") {
    let session = await getAuthSession(request.headers.get("cookie"));

    return redirectWithSuccess(
      "/sign-in",
      {
        message: "You have been logged out",
      },
      {
        headers: {
          "Set-Cookie": await destroyAuthSession(session),
        },
      }
    );
  }
}

export default function Protected() {
  return (
    <Layout>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Protected route</CardTitle>
          <CardDescription>
            Your are logged in and can see this content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form className="grid gap-4" method="post">
            <Button
              type="submit"
              name="_action"
              value="logOut"
              className="w-full"
            >
              Logout
            </Button>
          </Form>
        </CardContent>
      </Card>
    </Layout>
  );
}
