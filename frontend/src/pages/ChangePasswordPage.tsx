import { motion } from 'framer-motion';
import { Lock, ShieldCheck } from 'lucide-react';
import ChangePassForm from '../components/ui/ChangePassForm';
import { useTheme } from '../contexts/ThemeContext';

export default function ChangePasswordPage() {
  const { theme } = useTheme();

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-100">
      
      {/* LEFT PANEL: FORM (Compact para walang scroll) */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="w-full max-w-md bg-white p-6 lg:p-7 rounded-2xl shadow-xl border border-slate-200"
        >
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 border border-amber-500/20 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
                Set New Password
              </h2>
            </div>
            
            <p className="text-slate-500 text-xs">
              Enter your email, temporary password, and create a secure new password.
            </p>
          </div>

          <ChangePassForm
            emailProp=""
          />
          
        </motion.div>
      </div>

      {/* RIGHT PANEL: BRANDING / IMAGE */}
      <div 
        className="relative hidden lg:flex w-1/2 h-full overflow-hidden transition-colors duration-700"
        style={{ backgroundColor: theme.activeParentBg }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 transition-all duration-700 grayscale-[30%]"
          style={{ backgroundImage: "url('/web_images/worship.avif')" }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950/70 via-slate-900/30 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between w-full h-full p-10 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border border-white/20 overflow-hidden bg-white/10 shrink-0 shadow-lg backdrop-blur-sm">
              <img src="/web_images/cdms_logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col justify-center select-none">
              <span className="text-xl font-black tracking-tight leading-none text-white drop-shadow-sm">
                Disciple<span className="text-white/60 font-medium">Network</span>
              </span>
              <span className="text-[10px] font-bold leading-none tracking-[0.25em] text-amber-400/90 uppercase mt-1.5 drop-shadow">
                Management System
              </span>
            </div>
          </div>
          
          <div className="space-y-6 max-w-lg">
            <div className="flex gap-3">
              <span className="px-3 py-1 text-[9px] font-bold tracking-widest uppercase bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-amber-100 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Account Security
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/70">
                Secure your ministry account.
              </h1>
              <p className="text-white/70 text-base font-medium leading-relaxed max-w-md">
                Protect sensitive church data and discipleship records by updating your temporary credentials to a strong, personal password.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-2xl" />
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide">Encrypted & Protected</h3>
                  <p className="text-[11px] text-white/50 mt-0.5">Your password is securely hashed and guarded for complete privacy.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <div className="text-xs text-white/50 font-medium">© 2026 DiscipleNetwork</div>
            <div className="flex gap-4 text-[9px] font-bold text-white/40 uppercase tracking-widest">
              <span>Secure</span>
              <span>•</span>
              <span>Encrypted</span>
              <span>•</span>
              <span>Protected</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}