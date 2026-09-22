import { Skeleton } from "@/components/ui/skeleton";

export function GallerySkeleton() {
  return (
    <div className="space-y-6">
      {/* Category filter skeleton */}
      <div className="flex items-center justify-between pb-6 border-b border-border/60">
        <Skeleton className="h-5 w-28 rounded-lg" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>

      {/* Editorial Grid Skeleton (1 large + 2 stacked on right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Featured Card Skeleton */}
        <div className="md:col-span-8 rounded-3xl overflow-hidden border border-border/60 bg-white p-2">
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
        </div>

        {/* 2 Stacked Right Cards Skeletons */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="rounded-3xl overflow-hidden border border-border/60 bg-white p-2 flex-1">
            <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          </div>
          <div className="rounded-3xl overflow-hidden border border-border/60 bg-white p-2 flex-1">
            <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          </div>
        </div>

        {/* Row 2 Skeletons */}
        <div className="md:col-span-4 rounded-3xl overflow-hidden border border-border/60 bg-white p-2">
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
        </div>
        <div className="md:col-span-8 rounded-3xl overflow-hidden border border-border/60 bg-white p-2">
          <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
