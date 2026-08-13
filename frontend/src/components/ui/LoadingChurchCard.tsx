export default function LoadingChurchCard({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between relative overflow-hidden animate-pulse"
        >
          {/* Top Border Indicator Skeleton */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-200" />

          <div>
            {/* Card Header Skeleton */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-5 w-16 bg-slate-200 rounded" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-200 rounded-full" />
                  <div className="h-6 w-36 bg-slate-200 rounded" />
                </div>
              </div>

              {/* Status Badge Placeholder */}
              <div className="h-6 w-16 bg-slate-100 rounded-full" />
            </div>

            {/* Stats Metrics Bar Skeleton */}
            <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-slate-50/80 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-slate-200 rounded-md" />
                <div className="space-y-1">
                  <div className="h-3 w-12 bg-slate-200 rounded" />
                  <div className="h-4 w-6 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-slate-200 rounded-md" />
                <div className="space-y-1">
                  <div className="h-3 w-12 bg-slate-200 rounded" />
                  <div className="h-4 w-6 bg-slate-200 rounded" />
                </div>
              </div>
            </div>

            {/* Contact Information Skeleton */}
            <div className="space-y-2.5 mb-6">
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-3/4 bg-slate-100 rounded" />
            </div>
          </div>

          {/* Buttons Skeleton */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="h-7 w-16 bg-slate-200 rounded-lg" />
            <div className="h-7 w-16 bg-slate-100 rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
}