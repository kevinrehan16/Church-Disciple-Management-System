import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// 1. Zod Schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Infer TS Type mula sa Zod Schema
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 2. React Hook Form with default values (Dito ilalagay ang default email/password)
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'superadmin@gcfsouthmetro.org',
      password: '',
    },
  });

  // 3. Clean Submit Handler (Nakatanggap na ng validated string values si 'data')
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // 1. Saluhin ang response mula sa login function
      const response = await login(data) as unknown as {
        user?: {
          mustChangePassword?: boolean;
        };
        mustChangePassword?: boolean;
      };

      // 2. Suriin kung true ang mustChangePassword (suportahan din ang snake_case sakali man)
      if (response?.user?.mustChangePassword) {
        navigate('/change-password', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      
      // Kung sakaling ibato ng backend sa catch block (error response)
      if (error?.response?.data?.mustChangePassword) {
        navigate('/change-password', { replace: true });
      } else {
        alert("Invalid credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* LEFT PANEL */}
      <div 
        className="relative hidden lg:flex w-1/2 overflow-hidden transition-colors duration-700"
        style={{ backgroundColor: theme.activeParentBg }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 transition-all duration-700 grayscale-[30%]"
          style={{ backgroundImage: "url('/web_images/worship.avif')" }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/30 to-transparent" />

        <div className="absolute -right-24 -top-12 transform rotate-[35deg] opacity-[0.03] text-white pointer-events-none">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[40rem] h-[50rem]">
            <path d="M11 2h2v7h7v2h-7v11h-2V11H4V9h7V2z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full h-full p-12 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border border-white/20 overflow-hidden bg-white/10 shrink-0 shadow-lg backdrop-blur-sm">
              <img src="/web_images/cdms_logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col justify-center select-none">
              <span className="text-2xl font-black tracking-tight leading-none text-white drop-shadow-sm">
                Disciple<span className="text-white/60 font-medium">Network</span>
              </span>
              <span className="text-[10px] font-bold leading-none tracking-[0.25em] text-amber-400/90 uppercase mt-1.5 drop-shadow">
                Management System
              </span>
            </div>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <div className="flex gap-3">
              <span className="px-3 py-1 text-[9px] font-bold tracking-widest uppercase bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-amber-100 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Discipleship
              </span>
              <span className="px-3 py-1 text-[9px] font-bold tracking-widest uppercase bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-amber-100 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Disciplemaking
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="font-heading text-5xl font-extrabold leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/70">
                Empowering the church to multiply.
              </h1>
              <p className="text-white/70 text-lg font-medium leading-relaxed max-w-md">
                An enterprise-grade platform built specifically for ministry. Equip leaders, track spiritual growth, and foster deep community connections with grace.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group hover:bg-white/[0.06] transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-2xl" />
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Centralized Ministry Network</h3>
                  <p className="text-xs text-white/50 mt-1">Seamlessly connect small groups, monitor discipleship tracks, and manage church data securely.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-12">
            <div className="text-sm text-white/50 font-medium">© 2026 DiscipleNetwork</div>
            <div className="flex gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
              <span>Secure</span>
              <span>•</span>
              <span>Scalable</span>
              <span>•</span>
              <span>Ministry-First</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-slate-200"
        >
          <div className="mb-8">
            <h2 className="font-heading text-3xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Sign in to the Disciple Network System.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative group" style={{ '--active-parent': theme.activeParentBg } as React.CSSProperties}>
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-[var(--active-parent)] transition-colors" />
                
                {/* 4. Nakakabit na ang {...register('email')} */}
                <input 
                  type="email"
                  {...register('email')}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-slate-900 placeholder:text-slate-400 focus:border-[var(--active-parent)] focus:ring-4 focus:ring-[var(--active-parent)]/20"
                  placeholder="admin@church.com"
                />
              </div>
              {errors.email && <p className="text-red-600 text-xs font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative group" style={{ '--active-parent': theme.activeParentBg } as React.CSSProperties}>
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-[var(--active-parent)] transition-colors" />
                
                {/* 5. Nakakabit na ang {...register('password')} */}
                <input 
                  type="password" 
                  {...register('password')}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-slate-900 placeholder:text-slate-400 focus:border-[var(--active-parent)] focus:ring-4 focus:ring-[var(--active-parent)]/20"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-600 text-xs font-medium">{errors.password.message}</p>}
            </div>

            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ backgroundColor: theme.activeParentBg, boxShadow: `0 10px 15px -3px ${theme.activeParentBg}40` }}
            >
              {isLoading ? "Authenticating..." : "Sign in to Portal"}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}