import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Lock, LockKeyhole, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useChangePassword } from '../hooks/usePass';

// 1. Zod Schema kasama ang Email
const changePasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  currentPassword: z.string().min(1, "Current or temporary password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: changePasswordMutate } = useChangePassword();

  // 2. React Hook Form setup
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // 3. Submit Handler
  const onSubmit = async (data: ChangePasswordFormValues) => {
    setIsLoading(true);
    try {
      console.log("Password change data:", data);
      // Halimbawa: await api.post('/change-password', data);
      changePasswordMutate(data);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Password change failed:", error);
      alert("Failed to change password. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            
            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <div className="relative group" style={{ '--active-parent': theme.activeParentBg } as React.CSSProperties}>
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-[var(--active-parent)] transition-colors" />
                <input 
                  type="email"
                  {...register('email')}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-slate-900 placeholder:text-slate-400 focus:border-[var(--active-parent)] focus:ring-4 focus:ring-[var(--active-parent)]/20"
                  placeholder="admin@church.com"
                />
              </div>
              {errors.email && <p className="text-red-600 text-[11px] font-medium">{errors.email.message}</p>}
            </div>

            {/* Current / Temporary Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Temporary Password</label>
              <div className="relative group" style={{ '--active-parent': theme.activeParentBg } as React.CSSProperties}>
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-[var(--active-parent)] transition-colors" />
                <input 
                  type="password"
                  {...register('currentPassword')}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-slate-900 placeholder:text-slate-400 focus:border-[var(--active-parent)] focus:ring-4 focus:ring-[var(--active-parent)]/20"
                  placeholder="••••••••"
                />
              </div>
              {errors.currentPassword && <p className="text-red-600 text-[11px] font-medium">{errors.currentPassword.message}</p>}
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">New Password</label>
              <div className="relative group" style={{ '--active-parent': theme.activeParentBg } as React.CSSProperties}>
                <LockKeyhole className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-[var(--active-parent)] transition-colors" />
                <input 
                  type="password" 
                  {...register('newPassword')}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-slate-900 placeholder:text-slate-400 focus:border-[var(--active-parent)] focus:ring-4 focus:ring-[var(--active-parent)]/20"
                  placeholder="••••••••"
                />
              </div>
              {errors.newPassword && <p className="text-red-600 text-[11px] font-medium">{errors.newPassword.message}</p>}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Confirm New Password</label>
              <div className="relative group" style={{ '--active-parent': theme.activeParentBg } as React.CSSProperties}>
                <LockKeyhole className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-[var(--active-parent)] transition-colors" />
                <input 
                  type="password" 
                  {...register('confirmPassword')}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-slate-900 placeholder:text-slate-400 focus:border-[var(--active-parent)] focus:ring-4 focus:ring-[var(--active-parent)]/20"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-600 text-[11px] font-medium">{errors.confirmPassword.message}</p>}
            </div>

            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-3"
              style={{ backgroundColor: theme.activeParentBg, boxShadow: `0 10px 15px -3px ${theme.activeParentBg}40` }}
            >
              {isLoading ? "Updating Password..." : "Update Password"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
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