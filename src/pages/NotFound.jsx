import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";

const NotFound = () => (
  <div className="mx-auto flex min-h-[60dvh] max-w-md flex-col items-center justify-center px-6 text-center">
    <p className="text-[13px] font-semibold text-primary">404</p>
    <h1 className="mt-2 font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
      This page isn’t here
    </h1>
    <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
      The link may be old, or the page may have moved.
    </p>
    <Link to="/" className={buttonVariants({ className: "mt-6" })}>
      Back to your dashboard
    </Link>
  </div>
);

export default NotFound;
