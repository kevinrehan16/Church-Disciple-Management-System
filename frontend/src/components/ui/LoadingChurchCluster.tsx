export default function LoadingChurchCluster({ count = 3 }) {
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between animate-pulse"
        >
          {/* Left Side: Icon + Name + Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-200" /> {/* Church Icon Placeholder */}
            <div className="space-y-2">
              <div className="h-5 w-48 bg-slate-200 rounded-md" /> {/* Name Placeholder */}
              <div className="h-4 w-64 bg-slate-100 rounded-md" /> {/* Info Placeholder */}
            </div>
          </div>

          {/* Right Side: Button + Badge Placeholder */}
          <div className="flex items-center gap-4">
            <div className="h-9 w-28 bg-slate-200 rounded-xl" /> {/* Add Cluster Button */}
            <div className="h-8 w-20 bg-slate-100 rounded-lg" />  {/* Count Badge */}
            <div className="w-8 h-8 rounded-full bg-slate-100" />  {/* Chevron */}
          </div>
        </div>
      ))}
    </div>
  );
}