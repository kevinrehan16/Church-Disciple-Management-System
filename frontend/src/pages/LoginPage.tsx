import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight } from 'lucide-react'; // Pinalitan ang User ng Mail icon
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import apiClient from '../api/axiosInstance'; 

// Pinalitan natin ng email validation para sumakto sa Laravel default auth
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const { fetchUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
        // 2. GAMITIN ANG AXIOS (PLAIN), HUWAG apiClient
        // I-target ang ROOT URL (i-remove ang /api/v1)
        const baseUrl = import.meta.env.VITE_API_URL.replace('/api/v1', '');
        
        await apiClient.get(`${baseUrl}/sanctum/csrf-cookie`, { 
            withCredentials: true 
        });

        // 3. Ngayon, pwede mo nang gamitin ang apiClient para sa login
        await apiClient.post('/login', {
            email: data.email,
            password: data.password
        });

        await fetchUser();
        navigate('/', { replace: true });
    } catch (error) {
        console.error("Login failed:", error);
        alert("Invalid credentials.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* LEFT PANEL: Dynamic Background */}
      <div 
        className="hidden lg:flex w-1/2 p-12 flex-col justify-between text-white transition-colors duration-500"
        style={{ backgroundColor: theme.activeParentBg }}
      >
        <div className="flex items-center gap-3">
          {/* Logo Wrapper (May overflow-hidden para perpektong bilog ang image) */}
          <div className="w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 shrink-0">
            <img src="/web_images/cdms_logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>

          {/* Text Wrapper (Naka-stack vertical/pababa) */}
          <div className="flex flex-col justify-center select-none">
            {/* Main Title */}
            <span className="text-2xl font-bold tracking-tight leading-tight text-white">
              Disciple<span className='text-slate-800'>Network</span>
            </span>
            
            {/* Subtitle */}
            <span className="text-[10px] font-bold leading-none tracking-widest text-white/60 uppercase mt-1">
              Management System
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="font-heading text-5xl font-extrabold leading-tight">
            Community management, handled with grace.
          </h1>
          <p className="text-white/80 text-lg font-medium max-w-md">
            The most reliable platform for modern churches. Secure, scalable, and built specifically for ministry leaders and administrators.
          </p>
        </div>
        
        <div className="text-sm text-white/60 font-medium">© 2026 DiscipleNetwork</div>
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
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:!text-[var(--active-parent,rgb(99,102,241))] transition-colors" />
                <input 
                  type="email"
                  {...register('email')} 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-slate-900 placeholder:text-slate-400 focus:border-[var(--active-parent,rgb(99,102,241))] focus:ring-4 focus:ring-[var(--active-parent,rgb(99,102,241))]/10 outline-none transition-all"
                  placeholder="admin@church.com"
                  value={"superadmin@gcfbacoor.com"}
                />
              </div>
              {errors.email && <p className="text-red-600 text-xs font-medium">{errors.email.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:!text-[var(--active-parent,rgb(99,102,241))] transition-colors" />
                <input 
                  type="password" 
                  {...register('password')} 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-slate-900 placeholder:text-slate-400 focus:border-[var(--active-parent,rgb(99,102,241))] focus:ring-4 focus:ring-[var(--active-parent,rgb(99,102,241))]/10 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-600 text-xs font-medium">{errors.password.message as string}</p>}
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