import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
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
import { createUser } from "~/models/users.server";
import { jsonWithError, redirectWithSuccess } from "remix-toast";
import { requireLoggedOutUser } from "~/auth.server";
import Layout from "~/components/layout";

export const passwordSchema = z
  .string({ required_error: "Type your password" })
  .min(8, "Must be at least 8 characters long");
// .refine(
//   (password) => /[A-Z]/.test(password),
//   "Password must include at least one uppercase letter"
// )
// .refine(
//   (password) => /[a-z]/.test(password),
//   "Password must include at least one lowercase letter"
// )
// .refine(
//   (password) => /[0-9]/.test(password),
//   "Password must include at least one number"
// )
// .refine(
//   (password) => /[!@#$%^&*]/.test(password),
//   "Password must include at least one special character"
// );

const signUpSchema = z.object({
  email: z
    .string({ required_error: "Type your email" })
    .email("It must be a valid email"),
  password: passwordSchema,
});

export async function loader({ request }: LoaderFunctionArgs) {
  await requireLoggedOutUser(request);
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let _action = z.string().parse(formData.get("_action"));

  if (_action === "signUp") {
    let submission = parseWithZod(formData, { schema: signUpSchema });

    if (submission.status !== "success") {
      return json(submission.reply());
    }

    let { error, success: isSuccess } = await createUser({
      email: submission.value.email,
      password: submission.value.password,
    });

    if (!isSuccess) {
      return jsonWithError(null, error.message);
    }

    return redirectWithSuccess(`/sign-in`, "Account created successfully");
  }

  return null;
}

export default function SignUp() {
  let actionData = useActionData<typeof action>();

  let [form, fields] = useForm({
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: signUpSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <Layout>
      <Card className="mx-auto max-w-sm min-w-96">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            className="grid gap-4"
            method="post"
            id={form.id}
            onSubmit={form.onSubmit}
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
              <Label htmlFor="password">Password</Label>
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
              className="w-full"
              name="_action"
              value="signUp"
            >
              Create an account
            </Button>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/sign-in" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
