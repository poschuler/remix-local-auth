import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css?url";
import { getToast } from "remix-toast";
import { useEffect } from "react";
import { Toaster } from "~/components/ui/toaster";
import { useToast } from "~/components/ui/use-toast";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { toast, headers } = await getToast(request);
  return json({ toast }, { headers });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={"dark"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex justify-center items-center w-screen h-screen">
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  let { toast: loaderToast } = useLoaderData<typeof loader>();
  let { toast } = useToast();

  useEffect(() => {
    if (loaderToast) {
      toast({ description: loaderToast.message });
    }
  }, [loaderToast]);

  return <Outlet />;
}
