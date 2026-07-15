import { motion } from 'framer-motion';

// 1. Loading Component
export const TableLoading = ({ rows = 5, columns = 6 }) => (
  <>
      <style>{`
        @keyframes nitro-shimmer {
          0% { transform: translateX(-150%) skewX(-25deg); }
          100% { transform: translateX(150%) skewX(-25deg); }
        }
      `}</style>
      
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-slate-50">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="p-4">
              <div 
                className="h-4 bg-slate-200 rounded-md relative overflow-hidden" 
                style={{ width: `${Math.random() * (90 - 40) + 40}%` }}
              >
                {/* Nitro Shimmer Beam */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 70%, transparent 100%)',
                  animation: 'nitro-shimmer 1.2s infinite linear',
                  transform: 'skewX(-25deg)'
                }} />
              </div>
            </td>
          ))}
        </tr>
      ))}
  </>
);

// 2. Error Component
export const TableError = ({ colSpan = 6, onRetry }: { colSpan?: number, onRetry: () => void }) => (
  <tr>
    <td colSpan={colSpan} className="p-20 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-3 text-red-600"
      >
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900">Failed to load</h3>
          <p className="text-sm text-slate-500">Something went wrong.</p>
        </div>
        <button 
          onClick={onRetry}
          className="mt-2 text-xs font-bold text-red-600 hover:text-red-700 underline"
        >
          Retry Connection
        </button>
      </motion.div>
    </td>
  </tr>
);

// 3. Empty Component
export const TableEmpty = ({ colSpan = 6, message = "No records found" }) => (
  <tr>
    <td colSpan={colSpan} className="p-20 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-4"
      >
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-slate-500">{message}</h3>
        </div>
      </motion.div>
    </td>
  </tr>
);