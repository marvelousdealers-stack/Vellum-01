import { isRouteErrorResponse, useRouteError } from "react-router";
import { Button } from "@/components/ui/button";

// Rendered by React Router when a route throws (render error, failed lazy
// import after a deploy, loader error) instead of a blank white screen.
const RouteError = () => {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : null;
  const stale = /dynamically imported module|Importing a module script failed/i.test(String(error?.message));

  return (
    <div role="alert" className="mx-auto flex min-h-[60dvh] max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink">
        {stale ? "A new version is available" : "Something went wrong"}
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
        {stale
          ? "Reload to get the latest Vellum."
          : status || "This page hit an unexpected error. Your data is safe — try again."}
      </p>
      <Button className="mt-6" onClick={() => window.location.reload()}>
        Reload
      </Button>
    </div>
  );
};

export default RouteError;
