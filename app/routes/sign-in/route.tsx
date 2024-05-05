import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { signInLocal } from "~/models/users.server";
import { commitAuthSession, getAuthSession } from "~/sessions.server";
import { jsonWithError, redirectWithSuccess } from "remix-toast";
import { requireLoggedOutUser } from "~/auth.server";
import Layout from "~/components/layout";

const signInSchema = z.object({
  email: z
    .string({ required_error: "Type your email" })
    .email("It must be a valid email"),
  password: z.string({ required_error: "Type your password" }),
});

export async function loader({ request }: LoaderFunctionArgs) {
  await requireLoggedOutUser(request);
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let _action = z.string().parse(formData.get("_action"));

  if (_action === "signIn") {
    let submission = parseWithZod(formData, { schema: signInSchema });

    if (submission.status !== "success") {
      return json(submission.reply());
    }

    let {
      data: { user },
      error,
      success: isSuccess,
    } = await signInLocal(submission.value.email, submission.value.password);

    if (!isSuccess) {
      return jsonWithError(null, error.message);
    }

    let session = await getAuthSession(request.headers.get("cookie"));
    session.set("user", user);
    return redirectWithSuccess(
      "/protected",
      {
        message: "You have been logged in",
      },
      {
        headers: {
          "Set-Cookie": await commitAuthSession(session),
        },
      }
    );
  }

  return null;
}

export default function SignIn() {
  let actionData = useActionData<typeof action>();

  let [form, fields] = useForm({
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: signInSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <Layout>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            className="grid gap-4"
            id={form.id}
            onSubmit={form.onSubmit}
            method="post"
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name={fields.email.name}
                id={fields.email.id}
                required={fields.email.required}
                key={fields.email.key}
                type="email"
                placeholder="m@example.com"
              />
              {fields.email.errors?.map((error, index) => (
                <span
                  key={`${fields.email.key}-error-${index}`}
                  className="text-sm text-muted-foreground"
                >
                  {error}
                </span>
              ))}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                name={fields.password.name}
                id={fields.password.id}
                key={fields.password.key}
                required={fields.password.required}
                minLength={fields.password.minLength}
                maxLength={fields.password.maxLength}
                type="password"
              />
              {fields.password.errors?.map((error, index) => (
                <span
                  key={`${fields.password.key}-error-${index}`}
                  className="text-sm text-muted-foreground"
                >
                  {error}
                </span>
              ))}
            </div>
            <Button
              type="submit"
              name="_action"
              value="signIn"
              className="w-full"
            >
              Login
            </Button>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
