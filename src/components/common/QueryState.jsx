import { EmptyState } from "./EmptyState";
import { Skeleton, SkeletonCard } from "./Skeleton";

// One consistent look for "still loading" and "couldn't load", used by every
// page that reads server data (hooks return { isLoading, error, refetch }).
export const PageLoading = () => (
  <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8" aria-busy="true">
    <div className="mb-6">
      <Skeleton height={34} width="28%" />
    </div>
    <div className="grid gap-4">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);

export const PageError = ({ error, onRetry }) => (
  <div className="mx-auto max-w-[760px] px-5 py-10">
    <EmptyState
      title="Couldn't load this page"
      body={error?.message || "Something went wrong. Check your connection and try again."}
      action={onRetry ? "Try again" : undefined}
      onAction={onRetry}
    />
  </div>
);
